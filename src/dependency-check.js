import path from 'path'
import { execa } from 'execa'
import merge from 'merge-options'
import { pkg } from './utils.js'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").DependencyCheckOptions} DependencyCheckOptions
 */

/**
 * @param {any} arr1
 * @param {any} arr2
 */
const isDefaultInput = (arr1, arr2) =>
  JSON.stringify(arr1) === JSON.stringify(arr2)
/**
 * Check dependencies
 *
 * @param {GlobalOptions & DependencyCheckOptions} argv - Command line arguments passed to the process.
 * @param {ExecaOptions} [execaOptions] - execa options.
 */
export default (argv, execaOptions) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  const input =
        argv.productionOnly &&
        isDefaultInput(argv.fileConfig.dependencyCheck.input, argv.input)
          ? argv.fileConfig.dependencyCheck.productionInput
          : argv.input
  const noDev = argv.productionOnly ? ['--no-dev'] : []
  const ignore = argv.ignore
    .concat(argv.fileConfig.dependencyCheck.ignore)
    .reduce((acc, i) => acc.concat('-i', i), /** @type {string[]} */ ([]))

  const args = [...input, '--missing', ...noDev, ...ignore]

  if (pkg.type === 'module') {
    // use detective-es6 for js, regular detective for cjs
    args.push(
      '--extensions', 'cjs:detective-cjs',
      '--extensions', 'js:detective-es6'
    )
  }

  return execa(
    'dependency-check',
    [...args, ...forwardOptions],
    merge(
      {
        localDir: path.join(__dirname, '..'),
        preferLocal: true
      },
      execaOptions
    )
  )
}
