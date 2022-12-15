
/* eslint-disable no-console */

import fs from 'fs-extra'
import path from 'path'
import {
  ensureFileHasContents
} from './utils.js'
import { toc as makeToc } from 'mdast-util-toc'
import { parseMarkdown, writeMarkdown } from './readme/utils.js'
import { HEADER } from './readme/header.js'
import { LICENSE } from './readme/license.js'
import { STRUCTURE } from './readme/structure.js'
import { APIDOCS } from './readme/api-docs.js'

/**
 * @param {string} projectDir
 * @param {string} repoUrl
 * @param {string} defaultBranch
 * @param {string[]} projectDirs
 */
export async function checkMonorepoReadme (projectDir, repoUrl, defaultBranch, projectDirs) {
  const repoParts = repoUrl.split('/')
  const repoName = repoParts.pop()
  const repoOwner = repoParts.pop()

  if (repoName == null || repoOwner == null) {
    throw new Error(`Could not parse repo owner & name from ${repoUrl}`)
  }

  console.info('Check README files')

  const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))

  const readmePath = path.join(projectDir, 'README.md')
  let readmeContents = ''

  if (fs.existsSync(readmePath)) {
    readmeContents = fs.readFileSync(path.join(projectDir, 'README.md'), {
      encoding: 'utf-8'
    })
  }

  // replace the magic OPTION+SPACE character that messes up headers
  readmeContents = readmeContents.replaceAll(' ', ' ')

  // parse the project's readme file
  const file = parseMarkdown(readmeContents)

  // create basic readme with heading, CI link, etc
  const readme = parseMarkdown(HEADER(pkg, repoOwner, repoName, defaultBranch))

  // remove existing header, CI link, etc
  /** @type {import('mdast').Root} */
  const parsedReadme = {
    type: 'root',
    children: []
  }

  let structureIndex = -1
  let tocIndex = -1
  let apiDocsIndex = -1
  let licenseFound = false

  file.children.forEach((child, index) => {
    const rendered = writeMarkdown(child).toLowerCase()

    if (child.type === 'heading' && index === 0) {
      // skip heading
      return
    }

    if (child.type === 'paragraph' && index === 1) {
      // skip badges
      return
    }

    if (child.type === 'blockquote' && tocIndex === -1 && tocIndex === -1) {
      // skip project overview
      return
    }

    if (rendered.includes('## table of')) {
      // skip toc header
      tocIndex = index
      return
    }

    if (tocIndex !== -1 && index === tocIndex + 1) {
      // skip toc
      return
    }

    if (child.type === 'heading' && rendered.includes('structure')) {
      // skip structure header
      structureIndex = index
      return
    }

    if (structureIndex !== -1 && index === structureIndex + 1) {
      // skip structure
      return
    }

    if (child.type === 'heading' && rendered.includes('api docs')) {
      // skip api docs header
      apiDocsIndex = index
      return
    }

    if (apiDocsIndex !== -1 && index === apiDocsIndex + 1) {
      // skip api docs link
      return
    }

    if ((child.type === 'heading' && rendered.includes('license')) || licenseFound) {
      licenseFound = true
      return
    }

    parsedReadme.children.push(child)
  })

  const license = parseMarkdown(LICENSE(pkg, repoOwner, repoName, defaultBranch))
  const apiDocs = parseMarkdown(APIDOCS(pkg))
  const structure = parseMarkdown(STRUCTURE(projectDir, projectDirs))

  parsedReadme.children = [
    ...structure.children,
    ...parsedReadme.children,
    ...apiDocs.children,
    ...license.children
  ]

  const toc = makeToc(parsedReadme, {
    tight: true
  })

  if (toc.map == null) {
    throw new Error('Could not create TOC for README.md')
  }

  readme.children = [
    ...readme.children,
    toc.map,
    ...parsedReadme.children
  ]

  await ensureFileHasContents(projectDir, 'README.md', writeMarkdown(readme))
}
