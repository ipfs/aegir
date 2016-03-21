'use strict'

const rimraf = require('rimraf')

module.exports = (gulp, done) => {
  rimraf('./lib', done)
}
