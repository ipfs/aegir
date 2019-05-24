'use strict'

const TASKS = [
  {
    title: 'Test Node.js',
    task: (opts) => require('./node')(opts),
    enabled: (ctx) => ctx.target.includes('node')
  },
  {
    title: 'Test Browser',
    task: (opts) => require('./browser')(opts),
    enabled: (ctx) => ctx.target.includes('browser')
  },
  {
    title: 'Test Webworker',
    task: (opts) => require('./browser')(Object.assign(opts, { webworker: true })),
    enabled: (ctx) => ctx.target.includes('webworker')
  },
  {
    title: 'Test Electron Main',
    task: (opts) => require('./electron')(Object.assign(opts, { renderer: false })),
    enabled: (ctx) => ctx.target.includes('electron-main')
  },
  {
    title: 'Test Electron Renderer',
    task: (opts) => require('./electron')(Object.assign(opts, { renderer: true })),
    enabled: (ctx) => ctx.target.includes('electron-renderer')
  }

]

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

      console.log(task.title) // eslint-disable-line no-console
      return task.task(opts)
    }, { concurrency: 1 })
  }
}
