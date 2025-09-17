import path from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import merge from '../utils/merge-options.js'
import { fromAegir, findBinary } from '../utils.js'
import { killIfCoverageHangs } from './utils.js'

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
  const extra = argv['--'] ? argv['--'] : []
  const forwardOptions = /** @type {string[]} */([
    ...extra,
    argv.timeout && `--timeout=${argv.timeout}`,
    argv.grep && `--grep=${argv.grep}`,
    argv.bail && '--bail'
  ].filter(Boolean))
  const watch = argv.watch ? ['--watch'] : []
  const cov = argv.cov ? ['--cov', '--report-dir', '.coverage'] : []
  const files = argv.files.length > 0
    ? argv.files
    : [
        'test/**/*.spec.*js',
        'test/browser.*js',
        'dist/test/**/*.spec.*js',
        'dist/test/browser.*js'
      ]

  // before hook
  const before = await argv.fileConfig.test.before(argv)
  const beforeEnv = before && before.env ? before.env : {}

  // run pw-test
  const proc = execa(findBinary('pw-test'),
    [
      ...files,
      '--mode', argv.runner === 'browser' ? 'main' : 'worker',
      // autodetect is broken in pw-test
      // https://github.com/hugomrdias/playwright-test/issues/573
      // https://github.com/hugomrdias/playwright-test/issues/572
      '--runner', 'mocha',
      ...watch,
      ...cov,
      '--config', fromAegir('src/config/pw-test.js'),
      ...forwardOptions
    ],
    merge(
      {
        env: {
          AEGIR_RUNNER: argv.runner,
          NODE_ENV: process.env.NODE_ENV || 'test',
          ...beforeEnv
        },
        preferLocal: true,
        localDir: path.join(__dirname, '../..'),
        stdio: 'inherit'
      },
      execaOptions
    )
  )

  await killIfCoverageHangs(proc, argv)

  // after hook
  await argv.fileConfig.test.after(argv, before)
}
