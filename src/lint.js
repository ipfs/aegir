'use strict'

const CLIEngine = require('eslint').CLIEngine
const path = require('path')

const CONFIG_FILE = path.resolve(__dirname, '..', 'config', 'eslintrc.yml')

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
  const cli = new CLIEngine({
    useEslintrc: false,
    configFile: CONFIG_FILE,
    fix: opts.fix
  })

  return cli.executeOnFiles(FILES)
}

module.exports = lint
