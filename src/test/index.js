'use strict'

const Listr = require('listr')
const _ = require('lodash')

const node = require('./node')
const browser = require('./browser')

const TASKS = new Listr([{
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
}])

module.exports = TASKS
