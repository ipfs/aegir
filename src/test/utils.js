import kleur from 'kleur'

/**
 * @param {import('execa').ResultPromise<{}>} proc
 * @param {{ cov: boolean, covTimeout: number }} argv
 */
export async function killIfCoverageHangs (proc, argv) {
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

          proc.kill('SIGTERM')
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
}
