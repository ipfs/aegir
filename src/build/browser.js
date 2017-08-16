'use strict'

const webpack = require('webpack')
const Uglify = require('uglify-es')
const path = require('path')
const Listr = require('listr')
const fs = require('fs-extra')
const filesize = require('filesize')
const pify = require('pify')

const clean = require('../clean')
const utils = require('../utils')
const config = require('../config/webpack')

function webpackBuild (ctx, task) {
  return config().then((config) => {
    return pify(webpack)(config)
  }).then((stats) => {
    ctx.webpackResult = stats

    const assets = stats.toJson().assets
      .filter((asset) => /\.(js)$/.test(asset.name))

    task.title += ` (${filesize(assets[0].size)})`
  })
}

function writeStats (ctx) {
  fs.writeJson(
    path.join(process.cwd(), 'stats.json'),
    ctx.webpackResult.toJson(),
    { spaces: 2 }
  )
}

function minify (ctx, task) {
  const minifiedPath = path.join(process.cwd(), 'dist', 'index.min.js')

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
        minifiedPath,
        minified
      )
    })
    .then(() => fs.stat(minifiedPath))
    .then((stats) => {
      task.title += ` (${filesize(stats.size)})`
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
}], utils.getListrConfig())

module.exports = TASKS
