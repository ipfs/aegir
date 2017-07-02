'use strict'

const webpack = require('webpack')
const Uglify = require('uglify-es')
const path = require('path')
const Listr = require('listr')
const fs = require('fs-extra')

const clean = require('../clean')

const WEBPACK_CONFIG = require('../../config/webpack')

function webpackBuild (ctx) {
  return new Promise((resolve, reject) => {
    webpack(WEBPACK_CONFIG, (err, stats) => {
      if (err) {
        return reject(err)
      }
      ctx.webpackResult = stats
      resolve(stats)
    })
  })
}

function writeStats (ctx) {
  fs.writeJson(
    path.join(process.cwd(), 'stats.json'),
    ctx.webpackResult.toJson(),
    { spaces: 2 }
  )
}

function minify () {
  return fs.readFile(path.join(process.cwd(), 'dist', 'index.js'))
    .then((code) => {
      const result = Uglify.minify(code.toString(), {
        mangle: false
      })
      if (result.error) {
        throw result.error
      }
      return result.code
    })
    .then((minified) => {
      return fs.writeFile(
        path.join(process.cwd(), 'dist', 'index.min.js'),
        minified
      )
    })
}

const TASKS = new Listr([{
  title: 'Clean ./dist',
  task: () => clean('dist')
}, {
  title: 'Webpack Build',
  task: webpackBuild
}, {
  title: 'Write stats to disk',
  task: writeStats,
  enabled: (ctx) => ctx.webpackResult != null && ctx.stats
}, {
  title: 'Minify',
  task: minify
}])

module.exports = TASKS
