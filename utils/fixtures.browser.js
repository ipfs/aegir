/* global self */
'use strict'

const { Buffer } = require('buffer')
/**
 * Loading fixture files in node and the browser can be painful, that's why aegir provides a method to do this.
 *
 * @example
 * ```js
 * // test/awesome.spec.js
 * const loadFixture = require('aegir/fixtures')
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
 * const loadFixture = require('aegir/fixtures')
 *
 * const myFixture = loadFixture('test/fixtures/coolfixture', 'awesome-tests')
 * ```
 *
 * The folder to be served to the browser by default is `process.cwd()` but can be change in the configuration.
 * ```js
 * module.exports = {
 *   test: {
 *     browser: {
 *       config: {
 *         assets: '..',
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {string} filePath
 * @param {string} module
 */
function loadFixtures (filePath, module) {
  if (module) {
    filePath = module + '/' + filePath
  }
  return syncXhr(filePath)
}

// @dignifiedquire: I know this is considered bad practice (syncXhr), but it
// makes testing life so much nicer!
/**
 * @param {string} filePath
 */
function syncXhr (filePath) {
  const target = filePath

  const request = new self.XMLHttpRequest()
  request.open('GET', target, false)
  request.overrideMimeType('text/plain; charset=x-user-defined')
  request.send(null)

  if (request.status === 200) {
    const filestream = request.responseText
    const res = new Uint8Array(filestream.length)

    for (let i = 0; i < filestream.length; i++) {
      res[i] = filestream.charCodeAt(i) & 0xff
    }

    return Buffer.from(res)
  } else {
    throw new Error(`Could not get the Fixture: ${filePath}`)
  }
}

module.exports = loadFixtures
