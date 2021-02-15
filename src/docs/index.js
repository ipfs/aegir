'use strict'

const Listr = require('listr')
const kleur = require('kleur')
const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')
const { premove: del } = require('premove')
const {
  hasTsconfig,
  fromAegir,
  fromRoot
} = require('../utils')
const ghPages = require('gh-pages')
const { promisify } = require('util')

const publishPages = promisify(ghPages.publish)

/**
 * @typedef {import("../types").GlobalOptions} GlobalOptions
 * @typedef {import("../types").DocsOptions} DocsOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 *
 * @typedef {Object} Options
 * @property {string} entryPoint - Entry point for typedoc (defaults: 'src/index.js')
 * @property {string[]} forwardOptions - Extra options to forward to the backend
 */

/**
 * Docs command
 *
 * @param {GlobalOptions & DocsOptions} ctx
 * @param {Task} task
 */
const docs = async (ctx, task) => {
  /** @type {Options} */
  const opts = {
    forwardOptions: ctx['--'] ? ctx['--'] : [],
    entryPoint: ctx.entryPoint
  }
  if (!hasTsconfig) {
    // eslint-disable-next-line no-console
    console.error(kleur.yellow('Documentation requires typescript config.\nTry running `aegir ts --preset config > tsconfig.json`'))
    return
  }
  // run typedoc
  const proc = execa(
    'typedoc',
    [
      fromRoot(opts.entryPoint),
      '--out', 'docs',
      '--hideGenerator',
      '--includeVersion',
      '--gitRevision', 'master',
      '--plugin', fromAegir('src/ts/typedoc-plugin.js'),
      ...opts.forwardOptions
    ],
    {
      localDir: path.join(__dirname, '..'),
      preferLocal: true
    }
  )
  proc.stdout?.on('data', chunk => {
    task.output = chunk.toString()
  })
  await proc

  // write .nojekyll file
  fs.writeFileSync('docs/.nojekyll', '')
}

const publishDocs = () => {
  return publishPages(
    'docs',
    // @ts-ignore - promisify returns wrong type
    {
      dotfiles: true,
      message: 'chore: update documentation'
    }
  )
}

const TASKS = new Listr(
  [
    {
      title: 'Clean ./docs',
      task: async () => del('docs')
    },
    {
      title: 'Generating documentation',
      task: (ctx, task) => docs({ debug: ctx.debug, tsRepo: ctx.tsRepo, ...ctx.config.docs }, task)
    },
    {
      title: 'Publish to GitHub Pages',
      task: publishDocs,
      enabled: (ctx) => ctx.publish && hasTsconfig
    }
  ],
  {
    renderer: 'verbose'
  }
)

module.exports = TASKS
