'use strict'

const CLIEngine = require('eslint').CLIEngine
const path = require('path')
const formatter = CLIEngine.getFormatter()
const userConfig = require('./config/user')
const globby = require('globby')

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

        if (/^(?!~)([<>=^]{1,2})[0]/.test(version)) {
          badVersions.push({
            type,
            name,
            version,
            message: 'development (e.g. < 1.0.0) versions should start with a ~'
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
  return new Promise(async (resolve, reject) => {
    const cli = new CLIEngine({
      useEslintrc: true,
      baseConfig: require('./config/eslintrc'),
      fix: opts.fix
    })

    const config = userConfig()
    const patterns = (config.lint && config.lint.files) || FILES
    const files = await globby(patterns)
    const report = cli.executeOnFiles(files)

    console.log(formatter(report.results)) // eslint-disable-line no-console

    if (report.errorCount > 0) {
      return reject(new Error('Lint errors'))
    }

    resolve()
  })
}

function lint (opts) {
  return Promise.all([
    runLinter(opts),
    checkDependencyVersions(opts)
  ])
}

module.exports = lint
