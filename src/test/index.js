'use strict'

const TASKS = [{
  title: 'Test Node.js',
  task: (opts) => {
    const node = require('./node')
    return node(opts)
  },
  enabled: (ctx) => ctx.target.includes('node')
}, {
  title: 'Test Browser',
  task: (opts) => {
    const browser = require('./browser')
    return browser.default(opts)
  },
  enabled: (ctx) => ctx.target.includes('browser')
}, {
  title: 'Test Webworker',
  task: (opts) => {
    const browser = require('./browser')
    return browser.webworker(opts)
  },
  enabled: (ctx) => ctx.target.includes('webworker')
}]

module.exports = {
  run (opts) {
    const userConfig = require('../config/user')
    const pmap = require('p-map')

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
