'use strict'

const Listr = require('listr')
const chalk = require('chalk')
const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')
const { premove: del } = require('premove')
const {
  getListrConfig,
  publishDocs,
  hasTsconfig,
  fromAegir,
  fromRoot
} = require('../utils')

/**
 * @typedef {Object} Options
 * @property {string} entryPoint - Entry point for typedoc (defaults: 'src/index.js')
 * @property {string[]} forwardOptions - Extra options to forward to the backend
 */

/**
 * Docs command
 *
 * @param {any} ctx
 */
const docs = async (ctx) => {
  /** @type {Options} */
  const opts = {
    forwardOptions: ctx['--'] ? ctx['--'] : [],
    entryPoint: ctx.entryPoint
  }
  if (!hasTsconfig) {
    // eslint-disable-next-line no-console
    console.error(chalk.yellow('Documentation requires typescript config.\nTry running `aegir ts --preset config > tsconfig.json`'))
    return
  }
  // run typedoc
  await execa(
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
      preferLocal: true,
      stdio: 'inherit'
    }
  )

  // write .nojekyll file
  fs.writeFileSync('docs/.nojekyll', '')
}

const TASKS = new Listr(
  [
    {
      title: 'Clean ./docs',
      task: async () => del('docs')
    },
    {
      title: 'Generating documentation',
      task: docs
    },
    {
      title: 'Publish to GitHub Pages',
      task: publishDocs,
      enabled: (ctx) => ctx.publish && hasTsconfig
    }
  ],
  getListrConfig()
)

module.exports = TASKS
