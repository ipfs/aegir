'use strict'

const path = require('path')
const pkg = require(path.resolve('package.json'))

let customConfig = {}
try {
  customConfig = require(path.resolve('.aegir.js'))
} catch (err) {
}

module.exports = {
  pkg: pkg,
  customPkg: pkg.aegir || {},
  customConfig: customConfig || {},
  entry: customConfig.entry || 'src/index.js'
}
