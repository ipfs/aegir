'use strict'

const execa = require('execa')
const which = require('npm-which')(__dirname)

const timeout = require('../../config/custom').timeout

function getBin (name) {
  return new Promise((resolve, reject) => {
    which(name, (err, res) => {
      if (err) {
        return reject(err)
      }
      resolve(res)
    })
  })
}

function istanbul () {
  return Promise.all([
    getBin('istanbul'),
    getBin('_mocha')
  ]).then((bins) => execa(bins[0], [
    'cover',
    bins[1],
    '--timeout', timeout,
    'test/node.js',
    'test/**/*.spec.js'
  ], {
    cwd: process.cwd()
  }))
}

module.exports = istanbul
