import kleur from 'kleur'
import stripAnsi from 'strip-ansi'

/**
 * @param {import('execa').ResultPromise<{}>} proc
 * @param {{ cov: boolean, covTimeout: number }} argv
 */
export async function killIfProcessHangs (proc, argv) {
  let killedAfterTestSuccess = false

  /** @type {ReturnType<setTimeout> | undefined} */
  let timeout

  proc.stderr?.addListener('data', (data) => {
    process.stderr.write(data)
  })

  let lastLine = ''
  proc.stdout?.addListener('data', (data) => {
    process.stdout.write(data)

    lastLine = stripAnsi(data.toString()).trim()

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
        if (argv.cov) {
          console.warn(kleur.red('!!! Process has while collecting coverage, manually killing it')) // eslint-disable-line no-console
          console.warn(kleur.red('!!! See https://github.com/ipfs/aegir/issues/1206 for more information')) // eslint-disable-line no-console
        } else {
          console.warn(kleur.red('!!! Process has hung after tests passed, manually killing it')) // eslint-disable-line no-console
          console.warn(kleur.red('!!! This module may be leaving processes running or leaving handles open')) // eslint-disable-line no-console
          console.warn(kleur.red('!!! Please debug with why-is-node-running or similar before submitting a PR')) // eslint-disable-line no-console
        }

        killedAfterTestSuccess = true

        proc.kill('SIGTERM')
      }, argv.covTimeout).unref()
    }
  })

  try {
    await proc
  } catch (err) {
    if (!killedAfterTestSuccess) {
      throw err
    }
  } finally {
    clearTimeout(timeout)
  }
}
