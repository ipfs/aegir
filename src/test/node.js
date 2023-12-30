import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import kleur from 'kleur'
import merge from 'merge-options'
import * as tempy from 'tempy'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import("../types.js").TestOptions} TestOptions
 * @typedef {import("../types.js").GlobalOptions} GlobalOptions
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
        '--report-dir', '.coverage',
        '--temp-directory', tempy.temporaryDirectory(),
        '--clean',
        'mocha'
      ]
    : []
  const files = argv.files.length > 0
    ? argv.files
    : [
        'test/node.{js,cjs,mjs}',
        'test/**/*.spec.{js,cjs,mjs}',
        'dist/test/node.{js,cjs,mjs}',
        'dist/test/**/*.spec.{js,cjs,mjs}'
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

  if (argv['--']) {
    args.push(...argv['--'])
  }

  if (os.platform() === 'win32') {
    args.push('--exit')
  }

  // before hook
  const before = await argv.fileConfig.test.before(argv)
  const beforeEnv = before && before.env ? before.env : {}

  // run mocha
  const proc = execa(exec, args,
    merge(
      {
        env: {
          AEGIR_RUNNER: 'node',
          NODE_ENV: process.env.NODE_ENV || 'test',
          ...beforeEnv
        },
        preferLocal: true,
        localDir: path.join(__dirname, '../..'),
        stdio: argv.cov ? 'pipe' : 'inherit'
      },
      execaOptions
    )
  )

  let killedWhileCollectingCoverage = false

  /** @type {ReturnType<setTimeout> | undefined} */
  let timeout

  if (argv.cov) {
    proc.stderr?.addListener('data', (data) => {
      process.stderr.write(data)
    })

    let lastLine = ''
    proc.stdout?.addListener('data', (data) => {
      process.stdout.write(data)

      lastLine = data.toString()

      if (lastLine.trim() !== '') {
        // more output has been sent, reset timer
        clearTimeout(timeout)
      }

      if (lastLine.match(/^ {2}\d+ (passing|pending)/m) != null) {
        // if we see something that looks like the successful end of a mocha
        // run, set a timer - if the process does not exit before the timer
        // fires, kill it and log a warning, though don't cause the test run
        // to fail
        timeout = setTimeout(() => {
          console.warn(kleur.red('!!! Collecting coverage has hung, killing process')) // eslint-disable-line no-console
          console.warn(kleur.red('!!! See https://github.com/ipfs/aegir/issues/1206 for more information')) // eslint-disable-line no-console
          killedWhileCollectingCoverage = true

          proc.kill('SIGTERM', {
            forceKillAfterTimeout: 1000
          })
        }, argv.covTimeout).unref()
      }
    })
  }

  try {
    await proc
  } catch (err) {
    if (!killedWhileCollectingCoverage) {
      throw err
    }
  } finally {
    clearTimeout(timeout)
  }

  // after hook
  await argv.fileConfig.test.after(argv, before)
}
