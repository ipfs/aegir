/// <reference types="node" />
export = loadFixtures;
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
declare function loadFixtures(filePath: string, module: string): Buffer;
import { Buffer } from "buffer";
//# sourceMappingURL=fixtures.browser.d.ts.map