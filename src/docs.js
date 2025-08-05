import path from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'
import { execa } from 'execa'
import fs from 'fs-extra'
import ghPages from 'gh-pages'
import Listr from 'listr'
import { hasTsconfig, fromAegir, fromRoot, readJson, isMonorepoParent } from './utils.js'

const publishPages = promisify(ghPages.publish)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import('./types.js').GlobalOptions} GlobalOptions
 * @typedef {import('./types.js').DocsOptions} DocsOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 */

/**
 * Docs command
 *
 * @param {GlobalOptions & DocsOptions} ctx
 * @param {Task} task
 */
const docs = async (ctx, task) => {
  const forwardOptions = ctx['--'] ? ctx['--'] : []

  let entryPoints

  if (isMonorepoParent) {
    entryPoints = await findMonorepoEntryPoints()
  } else {
    entryPoints = await findProjectEntryPoints()
  }

  // run typedoc
  const proc = execa(
    'typedoc',
    [
      ...entryPoints,
      '--out',
      ctx.directory,
      '--plugin',
      fromAegir('src/docs/unknown-symbol-resolver-plugin.js'),
      '--plugin',
      fromAegir('src/docs/type-indexer-plugin.js'),
      '--plugin',
      'typedoc-plugin-mdn-links',
      '--plugin',
      fromAegir('src/docs/readme-updater-plugin.js'),
      '--plugin',
      'typedoc-plugin-mermaid',
      ...forwardOptions
    ],
    {
      localDir: path.join(__dirname, '..'),
      preferLocal: true,
      all: true,
      env: {
        // large projects can cause OOM errors
        NODE_OPTIONS: '--max_old_space_size=8192'
      }
    }
  )
  proc.all?.on('data', (chunk) => {
    task.output = chunk.toString().replace('\n', '')
  })
  await proc

  // write `.nojekyll` file
  fs.writeFileSync(`${ctx.directory}/.nojekyll`, '')
}

async function findProjectEntryPoints () {
  const exportsMap = readJson(fromRoot('package.json')).exports

  if (!hasTsconfig) {
    throw new Error('Documentation requires typescript config')
  }

  if (exportsMap == null) {
    throw new Error('Documentation requires exports map')
  }

  const entryPoints = [
    '--tsconfig',
    'tsconfig.json'
  ]

  Object.values(exportsMap).forEach(map => {
    const path = map.import

    if (path == null) {
      return
    }

    if (path.includes('./dist/src')) {
      // transform `./dist/src/index.js` to `./src/index.ts`
      entryPoints.push(`.${path.match(/\.\/dist(\/src\/.*).js/)[1]}.ts`)
    } else {
      entryPoints.push(path)
    }
  })

  return entryPoints
}

async function findMonorepoEntryPoints () {
  /** @type {string[]} */
  return [
    '.',
    '--entryPointStrategy',
    'packages'
  ]
}

/**
 * @typedef {object} PublishDocsConfig
 * @property {string} PublishDocsConfig.user
 * @property {string} PublishDocsConfig.email
 * @property {string} PublishDocsConfig.message
 * @property {string} PublishDocsConfig.directory
 * @property {string} [PublishDocsConfig.cname]
 */

/**
 * @param {PublishDocsConfig} config
 */
const publishDocs = async (config) => {
  // https://github.com/tschaub/gh-pages#deploying-with-github-actions
  await execa('git', ['remote', 'set-url', 'origin', `https://git:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`])

  return publishPages(
    config.directory,
    // @ts-ignore - promisify returns wrong type
    {
      dotfiles: true,
      message: config.message,
      user: {
        name: config.user,
        email: config.email
      },
      cname: config.cname
    }
  )
}

const tasks = new Listr(
  [
    {
      title: 'Clean output dir',
      /**
       * @param {GlobalOptions & DocsOptions} ctx
       */
      task: (ctx) => {
        if (fs.existsSync(ctx.directory)) {
          fs.rmSync(ctx.directory, {
            recursive: true
          })
        }
      }
    },
    {
      title: 'Generating documentation',
      /**
       * @param {GlobalOptions & DocsOptions} ctx
       * @param {Task} task
       */
      task: docs
    },
    {
      title: 'Publish to GitHub Pages',
      task: (ctx) => publishDocs(ctx),
      enabled: (ctx) => ctx.publish
    }
  ],
  {
    renderer: 'verbose'
  }
)

export default tasks
