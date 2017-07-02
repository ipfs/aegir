'use strict'

const rimraf = require('rimraf')
const path = require('path')

function clean (dir) {
  return new Promise((resolve, reject) => {
    rimraf(path.join(process.cwd(), dir), (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

module.exports = clean
