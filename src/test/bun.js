import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'
import fs from 'fs-extra'
import merge from '../utils/merge-options.js'
import { killIfProcessHangs } from './utils.js'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const mochaPackageFile = require.resolve('mocha/package.json')
const mochaManifest = fs.readJSONSync(mochaPackageFile)
const mochaBinary = path.join(path.dirname(mochaPackageFile), mochaManifest.bin._mocha)

const bunPackageFile = require.resolve('bun/package.json')
const bunManifest = fs.readJSONSync(bunPackageFile)
const bunBinary = path.join(path.dirname(bunPackageFile), bunManifest.bin.bun)

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('../types.js').TestOptions} TestOptions
 * @typedef {import('../types.js').GlobalOptions} GlobalOptions
 */

/**
 * @param {TestOptions & GlobalOptions} argv
 * @param {ExecaOptions} execaOptions
 */
export default async function testBun (argv, execaOptions) {
  const progress = argv.progress ? ['--reporter=progress'] : []
  const files = argv.files.length > 0
    ? argv.files
    : [
        'test/bun.*js',
        'test/node.*js',
        'test/**/*.spec.*js',
        'test/bun.*ts',
        'test/node.*ts',
        'test/**/*.spec.*ts'
      ]

  const args = [
    mochaBinary,
    ...files,
    ...progress,
    '--ui', 'bdd',
    '--require', 'source-map-support/register',
    `--timeout=${argv.timeout}`,
    '--color', 'true'
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
  const proc = execa(bunBinary, args,
    merge(
      {
        env: {
          AEGIR_RUNNER: 'bun',
          NODE_ENV: process.env.NODE_ENV || 'test',
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

  await killIfProcessHangs(proc, argv)

  // after hook
  await argv.fileConfig.test.after(argv, before)
}
