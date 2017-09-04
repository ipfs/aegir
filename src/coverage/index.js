'use strict'

const path = require('path')
const _ = require('lodash')
const Listr = require('listr')

const providers = require('./providers')
const testNode = require('../test/node')
const utils = require('../utils')
const userConfig = require('../config/user')

function coverage (opts) {
  opts.hooks = userConfig().hooks

  const getCoverage = (ctx) => testNode(Object.assign({}, ctx, {
    coverage: true
  }))

  const providerNames = Object.keys(providers)

  if (providerNames.length === 0 || !opts.upload) {
    return getCoverage(opts)
  }

  const tasks = new Listr([{
    title: 'Generating Coverage Report',
    task: getCoverage
  }].concat(providerNames.map((name) => ({
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
