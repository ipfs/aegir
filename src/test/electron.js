import path from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import kleur from 'kleur'
import merge from '../utils/merge-options.js'
import { getElectron, findBinary } from '../utils.js'
import { killProcessIfHangs } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('./../types').TestOptions} TestOptions
 * @typedef {import('./../types').GlobalOptions} GlobalOptions
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
        'test/**/*.spec.{js,mjs,cjs}',
        'dist/test/**/*.spec.{js,cjs,mjs}'
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

  const proc = execa(findBinary('electron-mocha'),
    [
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
      env: {
        AEGIR_RUNNER: argv.runner,
        NODE_ENV: process.env.NODE_ENV || 'test',
        ELECTRON_PATH: electronPath,
        ...beforeEnv
      },
      preferLocal: true,
      localDir: path.join(__dirname, '../..'),
      stdio: 'pipe'
    },
    execaOptions)
  )

  const killedWhileCollectingCoverage = await killProcessIfHangs(proc, argv.covTimeout)

  if (argv.cov && killedWhileCollectingCoverage) {
    console.warn(kleur.red('!!! Collecting coverage has hung, killing process')) // eslint-disable-line no-console
    console.warn(kleur.red('!!! See https://github.com/ipfs/aegir/issues/1206 for more information')) // eslint-disable-line no-console
  }

  // after hook
  await argv.fileConfig.test.after(argv, before)
}
