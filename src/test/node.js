import { execa } from 'execa'
import path from 'path'
import tempy from 'tempy'
import merge from 'merge-options'
import { isTypescript } from '../utils.js'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
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
export default async function testNode (argv, execaOptions) {
  const exec = argv.cov ? 'c8' : 'mocha'
  const progress = argv.progress ? ['--reporter=progress'] : []
  const covArgs = argv.cov
    ? [
        '--reporter', 'json',
        '--report-dir', '.nyc_output',
        '--temp-directory', tempy.directory(),
        '--clean',
        'mocha'
      ]
    : []
  const files = argv.files.length > 0
    ? argv.files
    : [
        'test/node.{js,ts,cjs,mjs}',
        'test/**/*.spec.{js,ts,cjs,mjs}'
      ]

  const args = [
    ...covArgs,
    ...files,
    ...progress,
    '--ui', 'bdd',
    '--require', 'source-map-support/register',
    `--timeout=${argv.timeout}`
  ]

  if (argv.grep) {
    args.push(`--grep=${argv.grep}`)
  }

  if (argv.watch) {
    args.push('--watch')
  }

  if (argv.bail) {
    args.push('--bail')
  }

  if (isTypescript) {
    args.push(...['--require', require.resolve('esbuild-register')])
  }

  if (argv['--']) {
    args.push(...argv['--'])
  }

  // before hook
  const before = await argv.fileConfig.test.before(argv)
  const beforeEnv = before && before.env ? before.env : {}

  // run mocha
  await execa(exec, args,
    merge(
      {
        env: {
          AEGIR_RUNNER: 'node',
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
  // after hook
  await argv.fileConfig.test.after(argv, before)
}
