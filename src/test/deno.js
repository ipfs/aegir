import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'
import fs from 'fs-extra'
import merge from '../utils/merge-options.js'
import { killIfCoverageHangs } from './utils.js'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const mochaPackageFile = require.resolve('mocha/package.json')
const mochaManifest = fs.readJSONSync(mochaPackageFile)
const mochaBinary = path.join(path.dirname(mochaPackageFile), mochaManifest.bin._mocha)

const denoPackageFile = require.resolve('deno/package.json')
const denoManifest = fs.readJSONSync(denoPackageFile)
const denoBinary = path.join(path.dirname(denoPackageFile), denoManifest.bin)

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
export default async function testNode (argv, execaOptions) {
  const exec = denoBinary
  const progress = argv.progress ? ['--reporter=progress'] : []
  const files = argv.files.length > 0
    ? argv.files
    : [
        'test/deno.*js',
        'test/**/*.spec.*js',
        'dist/test/deno.*js',
        'dist/test/**/*.spec.*js'
      ]

  const args = [
    '-A',
    mochaBinary,
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

  if (argv['--']) {
    args.push(...argv['--'])
  }

  // before hook
  const before = await argv.fileConfig.test.before(argv)
  const beforeEnv = before && before.env ? before.env : {}

  // run mocha
  const proc = execa(exec, args,
    merge(
      {
        env: {
          AEGIR_RUNNER: 'deno',
          DENO_ENV: process.env.DENO_ENV || 'test',
          ...beforeEnv
        },
        preferLocal: true,
        localDir: path.join(__dirname, '../..'),
        stdio: argv.cov ? 'pipe' : 'inherit',
        forceKillAfterDelay: 1_000
      },
      execaOptions
    )
  )

  await killIfCoverageHangs(proc, argv)

  // after hook
  await argv.fileConfig.test.after(argv, before)
}
