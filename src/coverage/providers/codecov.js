'use strict'

const codecov = require('codecov/lib/codecov').upload

function upload (filepath) {
  if (process.env.CODECOV_TOKEN === undefined) {
    throw new Error('Missing environment variable `CODECOV_TOKEN`')
  }
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
