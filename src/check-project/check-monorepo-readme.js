/* eslint-disable complexity */
/* eslint-disable no-console */

import path from 'path'
import fs from 'fs-extra'
import { APIDOCS } from './readme/api-docs.js'
import { HEADER } from './readme/header.js'
import { LICENSE } from './readme/license.js'
import { STRUCTURE } from './readme/structure.js'
import { parseMarkdown, writeMarkdown } from './readme/utils.js'
import {
  ensureFileHasContents
} from './utils.js'

/**
 * @param {string} projectDir
 * @param {string} repoUrl
 * @param {string} webRoot
 * @param {string} defaultBranch
 * @param {string[]} projectDirs
 * @param {string} ciFile
 */
export async function checkMonorepoReadme (projectDir, repoUrl, webRoot, defaultBranch, projectDirs, ciFile) {
  const repoParts = repoUrl.split('/')
  const repoName = repoParts.pop()
  const repoOwner = repoParts.pop()

  if (repoName == null || repoOwner == null) {
    throw new Error(`Could not parse repo owner & name from ${repoUrl}`)
  }

  console.info('Check monorepo README files')

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
  const readme = parseMarkdown(HEADER(pkg, repoOwner, repoName, defaultBranch, ciFile))

  /** @type {import('mdast').RootContent[]} */
  const header = []

  /** @type {import('mdast').RootContent[]} */
  const other = []

  /** @type {import('mdast').RootContent[]} */
  const about = []

  /** @type {import('mdast').RootContent[]} */
  const footer = []

  let skipBlockHeader = -1
  let inAboutBlock = false
  let foundBadges = false

  // remove existing header, CI link, etc
  file.children.forEach((child) => {
    const rendered = writeMarkdown(child).toLowerCase()

    if (child.type === 'heading' && rendered.includes(pkg.name)) {
      // skip heading
      return
    }

    if (skipBlockHeader > -1 && child.type === 'heading' && child.depth <= skipBlockHeader) {
      skipBlockHeader = -1
      inAboutBlock = false
    }

    if (rendered === `> ${pkg.description.toLowerCase()}\n`) {
      // skip project description
      return
    }

    if (child.type === 'paragraph' && rendered.includes('![ci]')) {
      // skip badges
      foundBadges = true
      return
    }

    if (child.type === 'heading' && rendered.includes('# about')) {
      // collect about section
      skipBlockHeader = child.depth
      inAboutBlock = true
      about.push(child)
      return
    }

    if (child.type === 'heading' && rendered.includes('# packages')) {
      // skip packages
      skipBlockHeader = child.depth
      return
    }

    if (child.type === 'heading' && rendered.includes('# api docs')) {
      // skip api docs
      skipBlockHeader = child.depth
      return
    }

    if (child.type === 'heading' && rendered.includes('# license')) {
      // skip license
      skipBlockHeader = child.depth
      return
    }

    if (child.type === 'heading' && (rendered.includes('# contribute') || rendered.includes('# contribution'))) {
      // skip contribute
      skipBlockHeader = child.depth
      return
    }

    if (child.type === 'definition') {
      footer.push(child)
      return
    }

    if (inAboutBlock) {
      about.push(child)
      return
    }

    if (!foundBadges) {
      header.push(child)
      return
    }

    if (skipBlockHeader > -1) {
      // skip this block
      return
    }

    other.push(child)
  })

  const license = parseMarkdown(LICENSE(pkg, repoOwner, repoName, webRoot, defaultBranch))

  /** @type {import('mdast').Root} */
  let apiDocs = {
    type: 'root',
    children: []
  }

  if (fs.existsSync(path.join(projectDir, 'typedoc.json')) || pkg.scripts.docs != null) {
    apiDocs = parseMarkdown(APIDOCS(pkg))
  }

  const structure = parseMarkdown(STRUCTURE(projectDir, projectDirs))

  readme.children = [
    ...header,
    ...readme.children,
    ...about,
    ...structure.children,
    ...other,
    ...apiDocs.children,
    ...license.children,
    ...footer
  ]

  await ensureFileHasContents(projectDir, 'README.md', writeMarkdown(readme))
}
