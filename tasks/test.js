'use strict'

const runSequence = require('run-sequence')

const utils = require('../src/utils')

module.exports = {
  fn (gulp, done) {
    runSequence.use(gulp)(
      'test:node',
      'test:browser',
      utils.exitOnFail
    )
  }
}
