'use strict'

const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

const CLIEngine = require('eslint').CLIEngine
const flow = require('flow-bin')
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

const eslint = (opts) => {
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

const typecheck = async (_opts) => {
  try {
    const { stdout } = await execFile(flow, ['check', '--color=always'])
    console.log(stdout)
  } catch (err) {
    console.error(err.stdout)
    console.error(err.stderr)
    throw new Error('Type check errors')
  }
}

const lint = async (opts) => {
  await eslint(opts)
  await typecheck(opts)
}

module.exports = lint
