'use strict'

const Listr = require('listr')
const kleur = require('kleur')
const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')
const { premove: del } = require('premove/sync')
const merge = require('merge-options')
const {
  hasTsconfig,
  fromAegir,
  fromRoot,
  readJson
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
  let userTSConfig = readJson(fromRoot('tsconfig.json'))
  const configPath = fromRoot('tsconfig-docs.aegir.json')

  try {
    if (userTSConfig.extends) {
      const extendedConf = readJson(require.resolve(userTSConfig.extends))

      userTSConfig = merge.apply({ concatArrays: true }, [
        extendedConf,
        userTSConfig
      ])

      delete userTSConfig.extends
    }

    const config = {
      ...userTSConfig
    }

    if (config.compilerOptions) {
      // remove config options that cause tsdoc to fail
      delete config.compilerOptions.emitDeclarationOnly
    }

    fs.writeJsonSync(
      configPath,
      config
    )

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
        '--tsconfig', configPath,
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
    proc.all?.on('data', chunk => {
      task.output = chunk.toString().replace('\n', '')
    })
    await proc

    // write .nojekyll file
    fs.writeFileSync('docs/.nojekyll', '')
  } finally {
    fs.removeSync(configPath)
  }
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

const tasks = new Listr(
  [
    {
      title: 'Clean ./docs',
      task: () => {
        del('docs')
        del('dist')
      }
    },
    {
      title: 'Generating documentation',
      /**
       *
       * @param {GlobalOptions & DocsOptions} ctx
       * @param {Task} task
       */
      task: docs
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

module.exports = tasks
