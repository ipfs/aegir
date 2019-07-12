'use strict'

const path = require('path')
const globby = require('globby')
const { CLIEngine } = require('eslint')
const userConfig = require('./config/user')
const formatter = CLIEngine.getFormatter()

const FILES = [
  '*.js',
  'bin/**',
  'config/**/*.js',
  'test/**/*.js',
  'src/**/*.js',
  'tasks/**/*.js',
  'benchmarks/**/*.js',
  '!**/node_modules/**'
]

function checkDependencyVersions () {
  const checkVersions = (type, pkg, key) => {
    const badVersions = []

    if (pkg[key]) {
      Object.keys(pkg[key]).forEach(name => {
        const version = pkg[key][name]

        if (/^(?!~)([<>=^]{1,2})0\.0/.test(version)) {
          badVersions.push({
            type,
            name,
            version,
            message: 'early versions (e.g. < 0.1.0) should start with a ~ or have no range'
          })
        }

        if (/^(?![~^])([<>=]{1,2})0/.test(version)) {
          badVersions.push({
            type,
            name,
            version,
            message: 'development versions (e.g. < 1.0.0) should start with a ^ or ~'
          })
        }

        if (/^(?!\^)([<>=~]{1,2})[1-9]/.test(version)) {
          badVersions.push({
            type,
            name,
            version,
            message: 'stable versions (e.g. >= 1.0.0) should start with a ^'
          })
        }
      })
    }

    return badVersions
  }

  return new Promise((resolve, reject) => {
    const pkg = require(path.join(process.cwd(), 'package.json'))
    const badVersions = []
      .concat(checkVersions('Dependency', pkg, 'dependencies'))
      .concat(checkVersions('Dev dependency', pkg, 'devDependencies'))
      .concat(checkVersions('Optional dependency', pkg, 'optionalDependencies'))
      .concat(checkVersions('Peer dependency', pkg, 'peerDependencies'))
      .concat(checkVersions('Bundled dependency', pkg, 'bundledDependencies'))

    if (badVersions.length) {
      badVersions.forEach(({ type, name, version, message }) => {
        console.log(`${type} ${name} had version ${version} - ${message}`) // eslint-disable-line no-console
      })

      return reject(new Error('Dependency version errors'))
    }

    resolve()
  })
}

function runLinter (opts = {}) {
  const cli = new CLIEngine({
    useEslintrc: true,
    baseConfig: require('./config/eslintrc.js'),
    fix: opts.fix
  })

  const config = userConfig()
  const patterns = (config.lint && config.lint.files) || FILES
  return globby(patterns)
    .then(files => {
      const report = cli.executeOnFiles(files)
      if (opts.fix) {
        CLIEngine.outputFixes(report)
      }
      console.log(formatter(report.results)) // eslint-disable-line no-console

      if (report.errorCount > 0) {
        throw new Error('Lint errors')
      }
      return report
    })
}

function lint (opts) {
  return Promise.all([
    runLinter(opts),
    checkDependencyVersions(opts)
  ])
}

module.exports = lint
