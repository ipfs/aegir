'use strict'

const path = require('path')
const fs = require('fs')

/**
 * note: filePath needs to be relative to the module root
 *
 * @param {string} filePath
 * @param {string} [module]
 */
function loadFixtures (filePath, module = '') {
  if (module) {
    filePath = path.join(module, filePath)
  }

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

/**
 * @param {string} filePath
 */
function resolve (filePath) {
  try {
    return require.resolve(filePath)
  } catch (error) {
    // ignore error
    return filePath
  }
}
module.exports = loadFixtures
