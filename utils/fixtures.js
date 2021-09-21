'use strict'

const path = require('path')
const fs = require('fs')

/**
 * Loading fixture files in node and the browser can be painful, that's why aegir provides a method to do this.
 *
 * @example
 * ```js
 * // test/awesome.spec.js
 * const loadFixture = require('aegir/utils/fixtures')
 *
 * const myFixture = loadFixture('test/fixtures/largefixture')
 * ```
 * The path to the fixture is relative to the module root.
 *
 * If you write a module like [interface-ipfs-core](https://github.com/ipfs/interface-ipfs-core)
 * which is to be consumed by other modules tests you need to pass in a third parameter such that
 * the server is able to serve the correct files.
 * @example
 * ```js
 * // awesome-tests module
 * const loadFixture = require('aegir/utils/fixtures')
 *
 * const myFixture = loadFixture('test/fixtures/coolfixture', 'awesome-tests')
 * ```
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
