/* eslint-env jest */
'use strict'

const sinon = require('sinon')

const utils = require('../src/utils')

describe('utils', () => {
  describe('getPathToPkg', () => {
    it('returns package in cwd', () => {
      sinon.stub(process, 'cwd').returns('hello')

      expect(utils.getPathToPkg()).toEqual('hello/package.json')
    })
  })
})
