import { hasTsconfig, fromAegir, fromRoot, readJson } from './utils.js'
import Listr from 'listr'
import kleur from 'kleur'
import fs from 'fs-extra'
import path from 'path'
import { execa } from 'execa'
import { promisify } from 'util'
import ghPages from 'gh-pages'
import { premove as del } from 'premove/sync'
import { fileURLToPath } from 'url'

const publishPages = promisify(ghPages.publish)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").DocsOptions} DocsOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 *
 * @typedef {object} Options
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
  const userTSConfig = readJson(fromRoot('tsconfig.json'))
  const configPath = fromRoot('tsconfig-docs.aegir.json')
  const exportsMap = readJson(fromRoot('package.json')).exports

  try {
    const config = {
      ...userTSConfig
    }

    if (config.compilerOptions) {
      // remove config options that cause tsdoc to fail
      delete config.compilerOptions.emitDeclarationOnly
    }

    fs.writeJsonSync(configPath, config, {
      spaces: 2
    })

    /** @type {Options} */
    const opts = {
      forwardOptions: ctx['--'] ? ctx['--'] : [],
      entryPoint: ctx.entryPoint
    }

    if (!hasTsconfig) {
      // eslint-disable-next-line no-console
      console.error(
        kleur.yellow('Documentation requires typescript config.')
      )
      return
    }

    /** @type {string[]} */
    const entryPoints = []

    if (exportsMap != null) {
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
    } else {
      entryPoints.push(opts.entryPoint)
    }

    // run typedoc
    const proc = execa(
      'typedoc',
      [
        ...entryPoints,
        '--tsconfig',
        configPath,
        '--out',
        'docs',
        '--hideGenerator',
        '--includeVersion',
        '--gitRevision',
        'master',
        '--plugin',
        'typedoc-theme-hierarchy',
        '--theme',
        'hierarchy',
        '--plugin',
        fromAegir('src/docs/typedoc-plugin.cjs'),
        '--plugin',
        fromAegir('src/docs/unknown-symbol-resolver.cjs'),
        ...opts.forwardOptions
      ],
      {
        localDir: path.join(__dirname, '..'),
        preferLocal: true,
        all: true
      }
    )
    proc.all?.on('data', (chunk) => {
      task.output = chunk.toString().replace('\n', '')
    })
    await proc

    // write .nojekyll file
    fs.writeFileSync('docs/.nojekyll', '')
  } finally {
    fs.removeSync(configPath)
  }
}

/**
 * @typedef {object} PublishDocsConfig
 * @property {string} PublishDocsConfig.user
 * @property {string} PublishDocsConfig.email
 * @property {string} PublishDocsConfig.message
 */

/**
 * @param {PublishDocsConfig} config
 */
const publishDocs = async (config) => {
  // https://github.com/tschaub/gh-pages#deploying-with-github-actions
  await execa('git', ['remote', 'set-url', 'origin', `https://git:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`])

  return publishPages(
    'docs',
    // @ts-ignore - promisify returns wrong type
    {
      dotfiles: true,
      message: config.message,
      user: {
        name: config.user,
        email: config.email
      }
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
      task: (ctx) => publishDocs(ctx),
      enabled: (ctx) => ctx.publish && hasTsconfig
    }
  ],
  {
    renderer: 'verbose'
  }
)

export default tasks
