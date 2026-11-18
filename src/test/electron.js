import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'
import merge from '../utils/merge-options.js'
import { getElectron } from '../utils.js'
import { killIfProcessHangs } from './utils.js'

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
        `test/${argv.runner === 'electron-renderer' ? 'electron-renderer' : 'electron-main'}.*js`,
        'test/**/*.spec.*js',
        `test/${argv.runner === 'electron-renderer' ? 'electron-renderer' : 'electron-main'}.*ts`,
        'test/**/*.spec.*ts'
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

  let nodeOptions = ''
  // electron-mocha runs Electron's bundled Node.js, not the host's, so check
  // that version to pick how TypeScript gets transformed
  const { stdout: electronNodeVersion } = await execa(electronPath, ['-p', 'process.versions.node'], {
    env: { ELECTRON_RUN_AS_NODE: '1' }
  })
  const nodeMajorVersion = parseInt(electronNodeVersion.split('.')[0])

  if (nodeMajorVersion < 26) {
    nodeOptions = '--experimental-strip-types --experimental-transform-types'
  } else {
    // see the node runner for why amaro is loaded on Node.js 26+
    nodeOptions = `--enable-source-maps --import=${import.meta.resolve('amaro/transform')}`
  }

  // start Electron with electron-mocha's entry point instead of its bin
  // script, because the bin script runs on the host Node.js and passes its
  // environment through, so the host would also have to accept NODE_OPTIONS
  // meant for Electron (Node.js 26 rejects --experimental-transform-types)
  const proc = execa(electronPath,
    [
      fileURLToPath(import.meta.resolve('electron-mocha/lib/main.js')),
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
      stdio: argv.cov ? 'pipe' : 'inherit',
      forceKillAfterDelay: 1_000,
      env: {
        AEGIR_RUNNER: argv.runner,
        NODE_ENV: process.env.NODE_ENV || 'test',
        NODE_OPTIONS: nodeOptions,
        ELECTRON_PATH: electronPath,
        ...beforeEnv
      }
    },
    execaOptions)
  )

  await killIfProcessHangs(proc, argv)

  // after hook
  await argv.fileConfig.test.after(argv, before)
}
