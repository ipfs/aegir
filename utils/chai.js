import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiParentheses from 'chai-parentheses'
import chaiSubset from 'chai-subset'
import chaiBites from 'chai-bites'
import chaiString from 'chai-string'

// Do not reorder these statements - https://github.com/chaijs/chai/issues/1298
chai.use(chaiAsPromised)
chai.use(chaiParentheses)
chai.use(chaiSubset)
chai.use(chaiBites)
chai.use(chaiString)

export const expect = chai.expect
export const assert = chai.assert
export { chai }
/*
module.exports = {
  expect,
  assert,
  chai,

  // this is to ensure that we import the chai types in the generated .d.ts file
  _: {
    chaiAsPromised,
    chaiParentheses,
    chaiSubset,
    chaiBites,
    chaiString
  }
}

// we don't actually want to export these things so remove the property
// @ts-ignore - the operand should be optional
delete module.exports._
*/
