'use strict'

const browserTasks = require('./browser')

function build (opts) {
  return browserTasks.run(opts)
}

module.exports = build
