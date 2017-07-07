'use strict'

const path = require('path')
const pkg = require(path.join(process.cwd(), 'package.json'))

let customConfig = {}
try {
  customConfig = require(path.join(process.cwd(), '.aegir.js'))
} catch (err) {
}

module.exports = {
  pkg: pkg,
  customPkg: pkg.aegir || {},
  customConfig: customConfig || {},
  entry: customConfig.entry || 'src/index.js'
}
