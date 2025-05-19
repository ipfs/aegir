import path from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import merge from '../utils/merge-options.js'
import { getElectron, findBinary } from '../utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('../types.js').TestOptions} TestOptions
 * @typedef {import('../types.js').GlobalOptions} GlobalOptions
 */

/**
 *
 * @param {TestOptions & GlobalOptions} argv
 * @param {ExecaOptions} execaOptions
 */
export default async (argv, execaOptions) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  const watch = argv.watch ? ['--watch'] : []
  const files = argv.files.length > 0
    ? [...argv.files]
    : [
        'test/**/*.spec.*js',
        'dist/test/**/*.spec.*js'
      ]
  const grep = argv.grep ? ['--grep', argv.grep] : []
  const progress = argv.progress ? ['--reporter=progress'] : []
  const bail = argv.bail ? ['--bail'] : []
  const timeout = argv.timeout ? [`--timeout=${argv.timeout}`] : []
  const renderer = argv.runner === 'electron-renderer' ? ['--renderer'] : []

  // before hook
  const before = await argv.fileConfig.test.before(argv)
  const beforeEnv = before && before.env ? before.env : {}
  const electronPath = await getElectron()

  await execa(findBinary('electron-mocha'),
    [
      // workaround for https://github.com/jprichardson/electron-mocha/issues/195
      '--no-sandbox',
      ...files,
      ...watch,
      ...grep,
      ...progress,
      ...bail,
      ...timeout,
      '--colors',
      '--full-trace',
      ...renderer,
      ...forwardOptions
    ],
    merge({
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit',
      env: {
        AEGIR_RUNNER: argv.runner,
        NODE_ENV: process.env.NODE_ENV || 'test',
        ELECTRON_PATH: electronPath,
        ...beforeEnv
      }
    },
    execaOptions)
  )
  // after hook
  await argv.fileConfig.test.after(argv, before)
}
