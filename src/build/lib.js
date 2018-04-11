// Babel transform all *.js files from `src` to `lib`
'use strict'

const path = require('path')

const babelCore = require('babel-core')
const chokidar = require('chokidar')
const fs = require('fs-extra')

const utils = require('../utils')

const babelConfig = {
  env: {
    development: {
      sourceMaps: 'inline',
      comments: false,
      presets: [
        [
          'env',
          {
            targets: {
              node: 'current'
            }
          }
        ],
        'flow-node'
      ]
    }
  }
}

/**
 * Babel transpiles a file from `src` to `lib`
 *
 * @param {string} filename The filename relative to the `src` directory
 *
 * @returns {Promise}
 */
const transform = (filename) => {
  const src = path.join('src', filename)
  const dest = path.join('lib', filename)

  // To have the right filename in the source map
  babelConfig.sourceFileName = path.join('..', src)

  return new Promise((resolve, reject) => {
    babelCore.transformFile(
      src, babelConfig, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.code)
      })
  }).then((code) => {
    return fs.outputFile(dest, code)
  })
}

const babel = (ctx) => {
  const srcDir = path.join(utils.getBasePath(), 'src')

  return new Promise((resolve, reject) => {
    // The watcher code is based on the babel-cli code (MIT licensed):
    // https://github.com/babel/babel/blob/6597a472b30419493f123bff1e9194e4c09e488e/packages/babel-cli/src/babel/dir.js#L164-L188`
    const watcher = chokidar.watch(srcDir, {
      persistent: ctx.watch,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 50,
        pollInterval: 10
      }
    })

    ;['add', 'change'].forEach((type) => {
      watcher.on(type, (filename) => {
        const relative = path.relative(srcDir, filename)
        console.log('Transpile file: ' + relative)
        transform(relative)
      })
    })

    watcher
      .on('ready', () => {
        // Finish the task after the initial scan. If files are watched, the
        // task will keep running though.
        resolve()
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

module.exports = babel
