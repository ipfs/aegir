'use strict'

const map = require('map-stream')
const git = require('gulp-git')
const _ = require('lodash')

module.exports = function (opts) {
  if (!opts) opts = {}

  function modifyContents (file, cb) {
    if (file.isNull()) return cb(null, file)
    if (file.isStream()) return cb(new Error('gulp-conntributors: streams not supported'))

    const json = JSON.parse(file.contents.toString())

    git.exec({args: 'log --no-merges --format="%aN|%aE"'}, (err, stdout) => {
      if (err) return cb(err)

      if (!stdout) {
        return cb(new Error('git log empty'))
      }

      const gitContribs = _(stdout.replace(/"/mig, '')
        .split('\n'))
        .compact()
        .map((line) => {
          const pair = line.toString().split('|')

          return {
            name: pair[0],
            email: pair[1]
          }
        })
        .uniqBy('email')
        .sortBy('name')
        .map((val) => `${val.name} <${val.email}>`)
        .value()

      json.contributors = gitContribs
      file.contents = new Buffer(JSON.stringify(json, null, 2))
      cb(null, file)
    })
  }

  return map(modifyContents)
}
