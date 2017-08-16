'use strict'

const pmap = require('p-map')
const _ = require('lodash')

const node = require('./node')
const browser = require('./browser')

const userConfig = require('../config/user')

const TASKS = [{
  title: 'Test Node.js',
  task: node,
  enabled: (ctx) => _.includes(ctx.target, 'node')
}, {
  title: 'Test Browser',
  task: browser.default,
  enabled: (ctx) => _.includes(ctx.target, 'browser')
}, {
  title: 'Test Webworker',
  task: browser.webworker,
  enabled: (ctx) => _.includes(ctx.target, 'webworker')
}]

module.exports = {
  run (opts) {
    opts.hooks = userConfig().hooks
    return pmap(TASKS, (task) => {
      if (!task.enabled(opts)) {
        return Promise.resolve()
      }

      console.log(task.title)
      return task.task(opts)
    }, {concurrency: 1})
  }
}
