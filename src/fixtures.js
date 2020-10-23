'use strict'

const path = require('path')

// note: filePath needs to be relative to the module root
module.exports = function loadFixtures (filePath, module) {
  if (module) {
    filePath = path.join(module, filePath)
  }

  const fs = require('fs')
  const paths = [
    path.join(process.cwd(), filePath),
    path.join(process.cwd(), 'node_modules', filePath),
    resolve(filePath)
  ]

  const resourcePath = paths.find(path => fs.existsSync(path))

  if (!resourcePath) {
    throw new Error(`Could not load ${filePath}`)
  }

  return fs.readFileSync(resourcePath)
}

function resolve (filePath) {
  try {
    return require.resolve(filePath)
  } catch (error) {
    // ignore error
  }
}
