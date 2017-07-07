'use strict'

const path = require('path')

exports.getPathToPkg = () => {
  return path.join(process.cwd(), 'package.json')
}
