export = loadFixtures;
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
declare function loadFixtures(filePath: string, module?: string | undefined): Buffer;
//# sourceMappingURL=fixtures.d.ts.map