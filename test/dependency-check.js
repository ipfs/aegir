/* eslint-env mocha */
'use strict'

const check = require('../src/dependency-check')
const { expect } = require('../utils/chai')
const path = require('path')

describe('dependency check', () => {
  it('should fail for missing deps', async () => {
    await expect(check(undefined, [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
    })).to.eventually.be.rejectedWith('execa')
  })

  it('should pass when there are no missing deps', async () => {
    await expect(check(undefined, [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
    })).to.eventually.be.fulfilled()
  })

  it('should forward options', async () => {
    await expect(check({ _: [], '--': ['--unused'], input: [] }, [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
    })).to.eventually.be.rejectedWith('Modules in package.json not used in code: pico')
  })

  it('should fail for missing production deps', async () => {
    await expect(check({ productionOnly: true, input: [] }, [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail-prod')
    })).to.eventually.be.rejectedWith('execa')
  })

  it('should pass for passed files', async () => {
    await expect(check({
      input: [
        'derp/foo.js'
      ]
    }, [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass-certain-files')
    })).to.eventually.be.fulfilled()
  })

  it('should pass for passed production files', async () => {
    await expect(check({
      productionOnly: true,
      input: [
        'derp/foo.js'
      ]
    }, [
      'node', 'aegir', 'dependency-check', 'derp/foo.js'
    ], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass-certain-files')
    })).to.eventually.be.fulfilled()
  })
})
