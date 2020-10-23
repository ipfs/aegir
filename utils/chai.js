'use strict'

const chai = require('chai')

// Do not reorder these statements - https://github.com/chaijs/chai/issues/1298
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
chai.use(require('chai-subset'))

module.exports = {
  expect: chai.expect,
  assert: chai.assert,
  chai
}
