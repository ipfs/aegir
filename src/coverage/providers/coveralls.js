'use strict'

const coveralls = require('coveralls')
const fs = require('fs-extra')

function uploadToCoveralls (content) {
  return new Promise((resolve, reject) => {
    coveralls.handleInput(content, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

function upload (filepath) {
  return fs.readFile(filepath)
    .then((content) => uploadToCoveralls(content.toString()))
}

module.exports = upload
