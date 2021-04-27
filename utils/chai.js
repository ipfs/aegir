'use strict'

const chai = require('chai')

// Do not reorder these statements - https://github.com/chaijs/chai/issues/1298
chai.use(require('chai-as-promised'))
// @ts-ignore no types
chai.use(require('chai-parentheses'))
chai.use(require('chai-subset'))
chai.use(require('chai-bytes'))
chai.use(require('chai-string'))

const expect = chai.expect
const assert = chai.assert

module.exports = {
  expect,
  assert,
  chai
}
