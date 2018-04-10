'use strict'

const Listr = require('listr')

const clean = require('../clean')
const dist = require('./dist')
const utils = require('../utils')

const TASKS = new Listr([{
  title: 'Clean ./dist',
  task: () => clean('dist'),
  enabled: (ctx) => ctx.dist
}, {
  title: 'Webpack Build',
  task: dist.webpackBuild,
  enabled: (ctx) => ctx.dist
}, {
  title: 'Write stats to disk',
  task: dist.writeStats,
  enabled: (ctx) => ctx.dist && ctx.webpackResult != null && ctx.stats
}, {
  title: 'Minify',
  task: dist.minify,
  enabled: (ctx) => ctx.dist
}], utils.getListrConfig())

module.exports = TASKS
