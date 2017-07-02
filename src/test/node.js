'use strict'

const Mocha = require('mocha')
const glob = require('glob')
const _ = require('lodash')

const CONFIG = require('../../config/custom').timeout

const FILES = [
  'test/node.js',
  'test/**/*.spec.js'
]

function testNode (ctx) {
  const mocha = new Mocha({
    ui: 'bdd',
    reporter: ctx.verbose ? 'spec' : 'progress',
    useColors: true,
    timeout: CONFIG.timeout
  })

  const files = _.flatten(FILES.map((pattern) => glob.sync(pattern)))
  files.forEach((file) => mocha.addFile(file))

  return new Promise((resolve, reject) => {
    mocha.run((failure) => {
      if (failure) {
        reject(new Error(`Failed ${failure} tests`))
      }
      resolve()
    })
  })
}

module.exports = testNode
