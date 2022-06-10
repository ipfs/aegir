
/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import {
  ensureFileHasContents
} from './utils.js'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { toc as makeToc } from 'mdast-util-toc'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { gfmTable } from 'micromark-extension-gfm-table'
import { gfmTableFromMarkdown, gfmTableToMarkdown } from 'mdast-util-gfm-table'
import { gfmFootnote } from 'micromark-extension-gfm-footnote'
import { gfmFootnoteFromMarkdown, gfmFootnoteToMarkdown } from 'mdast-util-gfm-footnote'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmStrikethroughFromMarkdown, gfmStrikethroughToMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTaskListItem } from 'micromark-extension-gfm-task-list-item'
import { gfmTaskListItemFromMarkdown, gfmTaskListItemToMarkdown } from 'mdast-util-gfm-task-list-item'

/**
 * @param {*} pkg
 * @param {string} repoUrl
 */
const HEADER = (pkg, repoUrl) => {
  return `
# ${pkg.name} <!-- omit in toc -->

[![test & maybe release](${repoUrl}/actions/workflows/js-test-and-release.yml/badge.svg)](${repoUrl}/actions/workflows/js-test-and-release.yml)

> ${pkg.description}

## Table of contents <!-- omit in toc -->
`
}

/**
 * @param {*} pkg
 */
const INSTALL = (pkg) => {
  return `
## Install

\`\`\`console
$ npm i ${pkg.name}
\`\`\`
  `
}

const LICENSE = `
## License

Licensed under either of

 * Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
 * MIT ([LICENSE-MIT](LICENSE-MIT) / http://opensource.org/licenses/MIT)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
`

/**
 * @param {string} md
 */
function parseMarkdown (md) {
  return fromMarkdown(md, {
    extensions: [
      gfm(),
      gfmTable,
      gfmFootnote(),
      gfmStrikethrough(),
      gfmTaskListItem
    ],
    mdastExtensions: [
      gfmFromMarkdown(),
      gfmTableFromMarkdown,
      gfmFootnoteFromMarkdown(),
      gfmStrikethroughFromMarkdown,
      gfmTaskListItemFromMarkdown
    ]
  })
}

/**
 *
 * @param {import('mdast').Root | import('mdast').Content} tree
 */
function writeMarkdown (tree) {
  return toMarkdown(tree, {
    extensions: [
      gfmToMarkdown(),
      gfmTableToMarkdown(),
      gfmFootnoteToMarkdown(),
      gfmStrikethroughToMarkdown,
      gfmTaskListItemToMarkdown
    ],
    bullet: '-',
    listItemIndent: 'one'
  })
}

/**
 * @param {string} projectDir
 * @param {string} repoUrl
 */
export async function checkReadme (projectDir, repoUrl) {
  console.info('Check README files')

  const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
    encoding: 'utf-8'
  }))

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
  const readme = parseMarkdown(HEADER(pkg, repoUrl))

  // remove existing header, CI link, etc
  /** @type {import('mdast').Root} */
  const parsedReadme = {
    type: 'root',
    children: []
  }

  let tocIndex = -1
  let installIndex = -1
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

    if (child.type === 'blockquote' && tocIndex === -1 && installIndex === -1) {
      // skip project overview
      return
    }

    if (rendered.includes('## table of')) {
      // skip toc header
      tocIndex = index
      return
    }

    if (tocIndex !== -1 && index === tocIndex + 1) {
      // skip toc header
      return
    }

    if (child.type === 'heading' && rendered.includes('install')) {
      // skip install
      installIndex = index
      return
    }

    if (installIndex !== -1 && index === installIndex + 1) {
      // skip install
      return
    }

    if ((child.type === 'heading' && rendered.includes('license')) || licenseFound) {
      licenseFound = true
      return
    }

    parsedReadme.children.push(child)
  })

  const installation = parseMarkdown(INSTALL(pkg))
  const license = parseMarkdown(LICENSE)

  parsedReadme.children = [
    ...installation.children,
    ...parsedReadme.children,
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
