'use strict'

const pmap = require('p-map')
const _ = require('lodash')

const node = require('./node')
const electronMain = require('./electron-main')
const browserTemplate = require('./browser')
const browser = browserTemplate(require('./browser-config'))
const electron = browserTemplate(require('./electron-config'))

const userConfig = require('../config/user')

const TASKS = [{
  title: 'Test Node.js',
  task: node,
  enabled: (ctx) => _.includes(ctx.target, 'node')
}, {
  title: 'Test Electron Main',
  task: electronMain,
  enabled: (ctx) => _.includes(ctx.target, 'electron-main')
}, {
  title: 'Test Browser',
  task: browser.default,
  enabled: (ctx) => _.includes(ctx.target, 'browser')
}, {
  title: 'Test Webworker',
  task: browser.webworker,
  enabled: (ctx) => _.includes(ctx.target, 'webworker')
}, {
  title: 'Test Electron Renderer',
  task: electron.default,
  enabled: (ctx) => _.includes(ctx.target, 'electron-renderer')
}, {
  title: 'Test Electron Renderer Webworker',
  task: electron.webworker,
  enabled: (ctx) => _.includes(ctx.target, 'electron-renderer-webworker')
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
