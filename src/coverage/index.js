'use strict'

const path = require('path')
const Listr = require('listr')

const providers = require('./providers')
const istanbul = require('./istanbul')

function publish (opts) {
  const coverFile = path.join(process.cwd(), 'coverage', 'lcov.info')
  return providers[opts.publisher](coverFile)
}

function coverage (opts) {
  const tasks = new Listr([{
    title: 'Generating Coverage Report',
    task: istanbul
  }, {
    title: `Publish report to ${opts.provider}`,
    task: publish,
    enabled: (ctx) => ctx.publish
  }])

  return tasks.run(opts)
}

exports.run = coverage
exports.providers = providers
