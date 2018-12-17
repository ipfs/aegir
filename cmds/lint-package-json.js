'use strict'

const resolveBin = require('resolve-bin')
const execa = require('execa')
const { fromAegir, fromRoot } = require('./../src/utils')

const bin = resolveBin.sync('npm-package-json-lint', { executable: 'npmPkgJsonLint' })

module.exports = {
  command: 'lint-package-json',
  desc: 'Lint package.json',
  handler (argv) {
    const input = argv._.slice(1)
    const useBuiltinConfig = !input.includes('--configFile')
    const config = useBuiltinConfig
      ? ['-c', fromAegir('src/config/.npmpackagejsonlintrc.json')]
      : []

    return execa(bin, [
      fromRoot('package.json'),
      ...config,
      ...input
    ], {
      stdio: 'inherit'
    })
  }
}
