'use strict'

const TASKS = [{
  title: 'Test Node.js',
  task: (opts) => require('./node')(opts),
  enabled: (ctx) => ctx.target.includes('node')
}, {
  title: 'Test Browser',
  task: (opts) => require('./browser')(opts),
  enabled: (ctx) => ctx.target.includes('browser')
}, {
  title: 'Test Webworker',
  task: (opts) => require('./browser')(Object.assign(opts, { webworker: true })),
  enabled: (ctx) => ctx.target.includes('webworker')
}]

module.exports = {
  run (opts) {
    const userConfig = require('../config/user')()
    const pmap = require('p-map')

    // TODO remove hooks and just use opts.userConfig
    opts.hooks = userConfig.hooks
    opts.userConfig = userConfig
    return pmap(TASKS, (task) => {
      if (!task.enabled(opts)) {
        return Promise.resolve()
      }

      console.log(task.title)
      return task.task(opts)
    }, { concurrency: 1 })
  }
}
