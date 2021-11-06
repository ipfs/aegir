'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiParentheses = require('chai-parentheses')
const chaiSubset = require('chai-subset')
const chaiBytes = require('chai-bytes')
const chaiString = require('chai-string')

// Do not reorder these statements - https://github.com/chaijs/chai/issues/1298
chai.use(chaiAsPromised)
chai.use(chaiParentheses)
chai.use(chaiSubset)
chai.use(chaiBytes)
chai.use(chaiString)

const expect = chai.expect
const assert = chai.assert

module.exports = {
  expect,
  assert,
  chai,

  // this is to ensure that we import the chai types in the generated .d.ts file
  _: {
    chaiAsPromised,
    chaiParentheses,
    chaiSubset,
    chaiBytes,
    chaiString
  }
}

// we don't actually want to export these things so remove the property
// @ts-ignore - the operand should be optional
delete module.exports._
