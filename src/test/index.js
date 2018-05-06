'use strict'

const pmap = require('p-map')
const _ = require('lodash')
const path = require('path')

const node = require('./node')
const browser = require('./browser')

const userConfig = require('../config/user')

const taskEnabled = (ctx, name) => _.includes(ctx.target, name)

const TASKS = [{
  id: 'node',
  title: 'Test Node.js',
  task: node
}, {
  id: 'browser',
  title: 'Test Browser',
  task: browser.default
}, {
  id: 'webworker',
  title: 'Test Webworker',
  task: browser.webworker
}]

module.exports = {
  run (opts) {
    const pkg = require(path.join(process.cwd(), 'package.json'))
    opts.hooks = userConfig().hooks
    return pmap(TASKS, (task) => {
      if (!taskEnabled(opts, task.id)) {
        return Promise.resolve()
      }

      if (pkg.aegir) {
        const pkgOpts = pkg.aegir.test[task.id]
        if (pkgOpts && pkgOpts.files) {
          opts.files = pkgOpts.files
        }
      }

      console.log(task.title)
      return task.task(opts)
    }, {concurrency: 1})
  }
}
