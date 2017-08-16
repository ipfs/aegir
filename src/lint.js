'use strict'

const CLIEngine = require('eslint').CLIEngine
const path = require('path')
const formatter = CLIEngine.getFormatter()

const CONFIG_FILE = path.resolve(__dirname, 'config', 'eslintrc.yml')

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

function lint (opts) {
  return new Promise((resolve, reject) => {
    const cli = new CLIEngine({
      useEslintrc: true,
      configFile: CONFIG_FILE,
      fix: opts.fix
    })

    const report = cli.executeOnFiles(FILES)

    console.log(formatter(report.results))

    if (report.errorCount > 0) {
      return reject(new Error('Lint errors'))
    }
    resolve()
  })
}

module.exports = lint
