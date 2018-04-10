// Babel transform all *.js files from `src` to `lib`
'use strict'

const path = require('path')

const babelCore = require('babel-core')
const fs = require('fs-extra')
const glob = require('glob')
const pify = require('pify')

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

const transform = (src, dest) => {
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

const babel = () => {
  const src = 'src'
  const dest = 'lib'

  return pify(glob)('./**/*.js', {
    cwd: path.join(process.cwd(), src)
  }).then((filenames) => {
    return Promise.all(filenames.map((filename) => {
      return transform(path.join(src, filename), path.join(dest, filename))
    }))
  })
}

module.exports = babel
