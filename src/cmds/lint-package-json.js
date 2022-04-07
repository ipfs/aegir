
import { execa } from 'execa'
import path from 'path'
import { fromAegir, fromRoot } from '../utils.js'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/tclindner/npm-package-json-lint#cli-commands-and-configuration
`

/** @type {CommandModule} */
export default {
  command: 'lint-package-json',
  describe: 'Lint package.json with aegir defaults.',
  aliases: ['lint-package', 'lpj'],
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    return yargs
      .epilog(EPILOG)
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    const input = argv._.slice(1)
    const forwardOptions = argv['--'] ? argv['--'] : []
    const useBuiltinConfig = !forwardOptions.includes('--configFile')
    const config = useBuiltinConfig
      ? ['-c', fromAegir('src/config/.npmpackagejsonlintrc.json')]
      : []

    await execa('npmPkgJsonLint', [
      fromRoot('package.json'),
      ...config,
      ...input,
      ...forwardOptions
    ], {
      stdio: 'inherit',
      localDir: path.join(__dirname, '..'),
      preferLocal: true
    })
  }
}
