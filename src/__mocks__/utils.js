/* eslint-env jest */
'use strict'

const utils = jest.genMockFromModule('../utils')

let pkg = Object.create(null)

utils.__setPkg = (newPkg) => {
  pkg = newPkg
}

utils.getPkg = () => Promise.resolve(pkg)

module.exports = utils
