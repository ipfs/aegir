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

module.exports = TASKS
