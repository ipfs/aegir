'use strict'

const codecov = require('codecov/lib/codecov').upload

function upload (filepath) {
  return new Promise((resolve, reject) => {
    codecov({
      options: {
        file: filepath,
        disable: 'search'
      }
    }, resolve, reject)
  })
}

module.exports = upload
