'use strict'

const CLIEngine = require('eslint').CLIEngine
const path = require('path')
const formatter = CLIEngine.getFormatter()
const userConfig = require('./config/user')
const reallyRequire = require('really-require')
const chalk = require('chalk')

const CONFIG_FILE = path.resolve(__dirname, 'config', 'eslintrc.js')

const FILES = [
  '*.js',
  'bin/**',
  'config/**/*.js',
  'test/**/*.js',
  'src/**/*.js',
  'tasks/**/*.js',
  'examples/**/*.js',
  'benchmarks/**/*.js',
  '!**/node_modules/**'
]

async function checkDependencies () {
  let ERROR = false
  // let WARN = false

  function warn (data) {
    let loc = ''
    if (data.location) {
      loc = data.location
      loc = ' @ ' + loc.file + ' ' + loc.from.line + ':' + loc.from.column + ' -> ' + loc.to.line + ':' + loc.to.column
    }
    if (data.error) {
      ERROR = true
      console.error(chalk`{red {bold ERROR}%s: %s}`, loc, data.message)
    } else {
      // WARN = true
      console.error(chalk`{yellow {bold WARN}%s: %s}`, loc, data.message)
    }
  }

  const result = await reallyRequire(process.cwd(), { sourceGlob: ['*.js', '!(node_modules|test|examples)/**/*.js'] })

  result.missing.forEach(warn)
  result.unused.forEach(warn)
  result.errors.forEach(err => {
    console.error(chalk`{red {bold PARSER ERROR}: %s @ %s}`, err.error.toString(), err.file)
    ERROR = true
  })

  if (ERROR) {
    throw new Error('Dependency errors')
  }

  /* if (WARN) { // TODO: should this be enabled?
    throw new Error('Dependency errors')
  } */
}

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
      badVersions.forEach(({type, name, version, message}) => {
        console.log(`${type} ${name} had version ${version} - ${message}`)
      })

      return reject(new Error('Dependency version errors'))
    }

    resolve()
  })
}

function runLinter (opts = {}) {
  return new Promise((resolve, reject) => {
    const cli = new CLIEngine({
      useEslintrc: true,
      configFile: CONFIG_FILE,
      fix: opts.fix
    })

    const config = userConfig()
    const files = (config.lint && config.lint.files) || FILES
    const report = cli.executeOnFiles(files)

    console.log(formatter(report.results))

    if (report.errorCount > 0) {
      return reject(new Error('Lint errors'))
    }

    resolve()
  })
}

function lint (opts) {
  return Promise.all([
    runLinter(opts),
    checkDependencyVersions(opts),
    checkDependencies(opts)
  ])
}

module.exports = lint
