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
  return config('development').then((config) => {
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
  const mapPath = path.join(process.cwd(), 'dist', 'index.min.js.map')

  return fs.readFile(path.join(process.cwd(), 'dist', 'index.js'))
    .then((code) => {
      const result = Uglify.minify(code.toString(), {
        mangle: true,
        compress: { unused: false },
        sourceMap: {
          filename: 'index.min.js',
          url: 'index.min.js.map'
        }
      })
      if (result.error) {
        throw result.error
      }
      return result
    })
    .then(({ code, map }) => {
      return fs.writeFile(mapPath, map).then(() => {
        return fs.writeFile(
          minifiedPath,
          code
        )
      })
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
