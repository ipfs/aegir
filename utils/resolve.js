'use strict'

const path = require('path')
const fs = require('fs')

/**
 * Returns the full path to the requested resource, if available
 *
 * @param {string} filePath
 * @param {string} [module]
 */
function resolve (filePath, module = '') {
  if (module) {
    filePath = path.join(module, filePath)
  }

  const paths = [
    path.join(process.cwd(), filePath),
    path.join(process.cwd(), 'node_modules', filePath),
    requireResolve(filePath)
  ]

  if (module) {
    // simulate node's node_modules lookup
    for (let i = 0; i < process.cwd().split(path.sep).length; i++) {
      const dots = new Array(i).fill('..')

      paths.push(
        path.resolve(
          path.join(process.cwd(), ...dots, 'node_modules', filePath)
        )
      )
    }
  }

  const resourcePath = paths.find(path => fs.existsSync(path))

  if (!resourcePath) {
    throw new Error(`Could not load ${filePath}`)
  }

  return resourcePath
}

/**
 * @param {string} filePath
 */
function requireResolve (filePath) {
  try {
    return require.resolve(filePath)
  } catch (error) {
    // ignore error
    return filePath
  }
}

module.exports = resolve
