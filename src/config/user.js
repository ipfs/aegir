'use strict'

const path = require('path')
const pkg = require(path.join(process.cwd(), 'package.json'))

let customConfig = {}
try {
  customConfig = require(path.join(process.cwd(), '.aegir.js'))
} catch (err) {
}

const customPkg = pkg.aegir || {}

module.exports = {
  pkg: pkg,
  customPkg: customPkg,
  customConfig: customConfig,
  entry: customConfig.entry || customPkg.entry || 'src/index.js'
}
