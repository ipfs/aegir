import fs from 'node:fs'
import path from 'node:path'
import * as td from 'typedoc'
import { parseMarkdown, writeMarkdown } from '../check-project/readme/utils.js'
import { isMonorepoParent, parseProjects, pkg } from '../utils.js'

/**
 * A plugin that updates the `About` section of a README with the rendered
 * contents of a `@packageDocumentation` tag.
 *
 * @param {td.Application} app
 */
export function load (app) {
  /** @type {Record<string, any>} */
  let projects = {}

  if (isMonorepoParent) {
    projects = parseProjects(process.cwd(), pkg.workspaces)
  }

  // when rendering has finished, work out which UrlMappings refer to the index
  // pages of the current module or monorepo packages
  app.renderer.on(td.RendererEvent.END, (/** @type {td.RendererEvent} */ evt) => {
    const urlMappings = evt.urls?.filter(urlMapping => {
      // skip anything without a model-level comment
      if (urlMapping.model?.comment == null) {
        return false
      }

      // single-module repo
      if (urlMapping.url === 'modules.html') {
        return true
      }

      // mono-repo and the model name matches a package name
      if (isMonorepoParent && projects[urlMapping.model.name] != null) {
        return true
      }

      return false
    }).map(urlMapping => {
      if (urlMapping.model?.comment == null) {
        throw new Error('Model comment was null')
      }

      if (isMonorepoParent) {
        return {
          comment: urlMapping.model.comment,
          manifestPath: path.join(projects[urlMapping.model.name].dir, 'package.json'),
          readmePath: path.join(projects[urlMapping.model.name].dir, 'README.md')
        }
      }

      return {
        comment: urlMapping.model.comment,
        manifestPath: path.join(process.cwd(), 'package.json'),
        readmePath: path.join(process.cwd(), 'README.md')
      }
    })

    urlMappings?.forEach(urlMapping => updateModule(urlMapping.comment, urlMapping.manifestPath, urlMapping.readmePath, app))
  })
}

/**
 * Turn the comment into markdown
 *
 * @param {td.Models.Comment} comment
 * @param {string} manifestPath
 * @param {string} readmePath
 * @param {td.Application} app
 * @returns {void}
 */
function updateModule (comment, manifestPath, readmePath, app) {
  const about = `
## About

${
  comment.summary
    .map(item => item.text)
    .join('')
}
${
  comment.blockTags
        .map(item => {
          if (item.tag === '@example') {
            return `
### Example

${
  item.content
    .map(item => item.text)
    .join('')
}
`
        }

        app.logger.warn(`Unknown block tag: ${item.tag}`)

        return ''
      })
}
`.trim()

  try {
    updateReadme(about, manifestPath, readmePath, app)
  } catch (/** @type {any} */ err) {
    app.logger.error(`Could not update README about section: ${err.stack}`)
  }
}

/**
 * Accept a markdown string and add it to the README, replacing any existing
 * "About" section
 *
 * @param {string} aboutMd
 * @param {string} manifestPath
 * @param {string} readmePath
 * @param {td.Application} app
 * @returns {void}
 */
function updateReadme (aboutMd, manifestPath, readmePath, app) {
  if (!fs.existsSync(readmePath)) {
    app.logger.error(`Could not read readme from ${readmePath}`)
  }

  const readmeContents = fs.readFileSync(readmePath, {
    encoding: 'utf-8'
  })
    // replace the magic OPTION+SPACE character that messes up headers
    .replaceAll(' ', ' ')

  if (!fs.existsSync(manifestPath)) {
    app.logger.error(`Could not read manifest from ${manifestPath}`)
  }

  const manifestContents = fs.readFileSync(manifestPath, {
    encoding: 'utf-8'
  })
  const manifest = JSON.parse(manifestContents)

  // parse the project's readme file
  const readme = parseMarkdown(readmeContents)
  const about = parseMarkdown(aboutMd)

  /** @type {import('mdast').Root} */
  const parsedReadme = {
    type: 'root',
    children: []
  }

  let foundAbout = false
  let aboutHeadingLevel = -1

  readme.children.forEach((child, index) => {
    const rendered = writeMarkdown(child).toLowerCase()

    if (child.type === 'blockquote' && rendered === `> ${manifest.description.toLowerCase()}\n`) {
      // insert the `About` section beneath the project description
      parsedReadme.children.push(
        child,
        ...about.children
      )

      return
    }

    if (child.type === 'heading' && rendered.includes('# about')) {
      // we have found an existing `About` section - skip all content until we
      // hit another heading equal or higher depth than `About
      foundAbout = true
      aboutHeadingLevel = child.depth

      // skip about
      return
    }

    if (foundAbout) {
      if (child.type === 'heading' && child.depth <= aboutHeadingLevel) {
        foundAbout = false
      } else {
        // skip all content until we hit another heading equal or higher depth
        // than `About`
        return
      }
    }

    parsedReadme.children.push(child)
  })

  const updatedReadmeContents = writeMarkdown(parsedReadme)

  fs.writeFileSync(readmePath, updatedReadmeContents, {
    encoding: 'utf-8'
  })
}
