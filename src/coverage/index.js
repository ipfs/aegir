'use strict'

const path = require('path')
const _ = require('lodash')
const Listr = require('listr')

const providers = require('./providers')
const testNode = require('../test/node')
const utils = require('../utils')

function coverage (opts) {
  const tasks = new Listr([{
    title: 'Generating Coverage Report',
    task (opts) {
      return testNode(Object.assign({}, opts, {
        coverage: true
      }))
    }
  }].concat(Object.keys(providers).map((name) => ({
    title: `Publish report to ${name}`,
    task: (opts) => {
      const coverFile = path.join(process.cwd(), 'coverage', 'lcov.info')
      return providers[name](coverFile)
    },
    enabled: (ctx) => ctx.upload && _.includes(ctx.providers, name)
  }))), utils.getListrConfig())

  return tasks.run(opts)
}

exports.run = coverage
exports.providers = providers
