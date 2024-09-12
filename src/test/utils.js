import pDefer from 'p-defer'
import stripAnsi from 'strip-ansi'

/**
 * @typedef {import("execa").ExecaChildProcess<string>} ExecaChildProcess
 */

/**
 * Kills the passed process if no output is received
 *
 * @param {ExecaChildProcess} proc
 * @param {number} covTimeout
 */
export async function killProcessIfHangs (proc, covTimeout) {
  const deferred = pDefer()
  let lastLine = ''

  /**
   * @param {Buffer} data
   */
  function maybeKill (data) {
    lastLine = stripAnsi(data.toString())

    if (lastLine.trim() !== '') {
      // more output has been sent, reset timer
      clearTimeout(timeout)
    }

    if (lastLine.match(/^ {2}\d+ (passing|pending)/m) != null || lastLine.match(/✔ Tests passed./m) != null) {
      // if we see something that looks like the successful end of a mocha
      // run, set a timer - if the process does not exit before the timer
      // fires, kill it and log a warning, though don't cause the test run
      // to fail
      timeout = setTimeout(() => {
        // resolve the promise so killing the process doesn't cause the test run
        // to fail
        deferred.resolve(true)

        proc.kill('SIGTERM', {
          forceKillAfterTimeout: 1000
        })
      }, covTimeout).unref()
    }
  }

  /** @type {ReturnType<setTimeout> | undefined} */
  let timeout

  proc.stderr?.addListener('data', (data) => {
    process.stderr.write(data)
    maybeKill(data)
  })
  proc.stdout?.addListener('data', (data) => {
    process.stdout.write(data)
    maybeKill(data)
  })

  proc
    .then(() => {
      deferred.resolve(false)
    }, err => {
      deferred.reject(err)
    })
    .finally(() => {
      clearTimeout(timeout)
    })

  return deferred.promise
}
