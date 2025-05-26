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
    projects = parseProjects(process.cwd(), Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages ?? [])
  }

  /**
   * when rendering has finished, work out which UrlMappings refer to the index
   * pages of the current module or monorepo packages
   *
   * @param {td.RendererEvent} evt
   */
  function onRendererEnd (evt) {
    const urlMappings = evt.pages?.filter(page => {
      // single-module repo, single export
      if (page.url === 'modules.html') {
        return true
      }

      // single-module repo, multiple export
      if (page.url === 'modules/index.html') {
        return true
      }

      // mono-repo and the model name matches a package name
      if (isMonorepoParent && projects[page.model.name] != null) {
        return true
      }

      return false
    }).map(page => {
      if (isMonorepoParent) {
        let project = page.model.name

        if (project === 'index' && page.model.parent != null) {
          project = page.model.parent?.name
        }

        if (projects[project] == null) {
          if (page.model instanceof td.ProjectReflection && page.model.variant === 'project') {
            // this is the monorepo root (monorepo packages have the variant
            // "declaration")
            return null
          }

          throw new Error(`Could not derive project name from url mapping model "${page.model.name}" with parent "${page.model.parent?.name}"`)
        }

        // @ts-expect-error wat
        let comment = page.model?.comment

        if (comment == null && page.model instanceof td.DeclarationReflection && page.model.children != null && page.model.children.length > 0) {
          // multi-export modules have a different structure
          comment = page.model.children
            .find(child => child.name === 'index')
            ?.comment
        }

        if (comment == null) {
          return null
        }

        return {
          comment,
          manifestPath: path.join(projects[project].dir, 'package.json'),
          readmePath: path.join(projects[project].dir, 'README.md')
        }
      }

      // @ts-expect-error wat
      if (page.model?.comment == null) {
        return null
      }

      return {
        // @ts-expect-error wat
        comment: page.model.comment,
        manifestPath: path.join(process.cwd(), 'package.json'),
        readmePath: path.join(process.cwd(), 'README.md')
      }
    })

    if (urlMappings == null) {
      return
    }

    for (const urlMapping of urlMappings) {
      if (urlMapping == null) {
        continue
      }

      updateModule(urlMapping.comment, urlMapping.manifestPath, urlMapping.readmePath, app)
    }
  }

  app.renderer.on(td.RendererEvent.END, onRendererEnd)
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
# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

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
## Example${item.name ? ` - ${item.name}` : ''}

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
      .join('')
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
