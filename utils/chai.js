/**
 * @packageDocumentation
 *
 * Chai instance pre-configured with several useful plugins:
 *
 * - {@link https://www.npmjs.com/package/chai-as-promised chai-as-promised}
 * - {@link https://www.npmjs.com/package/chai-parentheses chai-parentheses}
 * - {@link https://www.npmjs.com/package/chai-subset chai-subset}
 * - {@link https://www.npmjs.com/package/chai-bytes chai-bytes}
 * - {@link https://www.npmjs.com/package/chai-string chai-string}
 *
 * @example
 *
 * ```js
 * import { expect } from 'aegir/chai'
 *
 * expect(true).to.be.true()
 * ```
 */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiBites from 'chai-bites'
import chaiParentheses from 'chai-parentheses'
import chaiString from 'chai-string'
import chaiSubset from 'chai-subset'

// Do not reorder these statements - https://github.com/chaijs/chai/issues/1298
chai.use(chaiAsPromised)
chai.use(chaiParentheses)
chai.use(chaiSubset)
chai.use(chaiBites)
chai.use(chaiString)

/**
 * @see {@link https://www.chaijs.com/api/bdd/ Chai expect/should docs}
 * @example
 *
 * ```js
 * import { expect } from 'aegir/chai'
 *
 * expect(true).to.be.true()
 * ```
 */
export const expect = chai.expect

/**
 * @see {@link https://www.chaijs.com/api/assert/ Chai assert docs}
 * @example
 *
 * ```js
 * import { assert } from 'aegir/chai'
 *
 * assert(true)
 * ```
 */
export const assert = chai.assert

export {
  chai,

  // this is to ensure that we import the chai types in the generated .d.ts file
  chaiAsPromised,
  chaiParentheses,
  chaiSubset,
  chaiBites,
  chaiString
}
