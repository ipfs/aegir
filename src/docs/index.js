'use strict'

const Listr = require('listr')

const utils = require('../utils')
const clean = require('../clean')
const publish = require('./publish')
const build = require('./build')

const TASKS = new Listr([{
  title: 'Clean ./docs',
  task: () => clean('docs')
}, {
  title: 'Generating documentation',
  task: build
}, {
  title: 'Publish to GitHub Pages',
  task: publish,
  enabled: (ctx) => ctx.publish
}], utils.getListrConfig())

module.exports = TASKS
