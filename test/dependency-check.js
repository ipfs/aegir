/* eslint-env mocha */
'use strict'

const check = require('../src/dependency-check')
const { expect } = require('../utils/chai')
const path = require('path')
const merge = require('merge-options')

// returns an object that looks like the yargs input
const yargsv = (overrides = {}) => {
  const argv = {
    _: [
      'dependency-check'
    ],
    input: check.defaultInput,
    ignore: []
  }

  return merge(argv, overrides)
}

describe('dependency check', () => {
  it('should fail for missing deps', async () => {
    await expect(check(yargsv(), [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
    })).to.eventually.be.rejectedWith('execa')
  })

  it('should pass when there are no missing deps', async () => {
    await expect(check(yargsv(), [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
    })).to.eventually.be.fulfilled()
  })

  it('should forward options', async () => {
    await expect(check(yargsv({ '--': ['--unused'] }), [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
    })).to.eventually.be.rejectedWith('Modules in package.json not used in code: pico')
  })

  it('should fail for missing production deps', async () => {
    await expect(check(yargsv({ productionOnly: true }), [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail-prod')
    })).to.eventually.be.rejectedWith('execa')
  })

  it('should pass for passed files', async () => {
    await expect(check(yargsv({
      input: [
        'derp/foo.js'
      ]
    }), [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass-certain-files')
    })).to.eventually.be.fulfilled()
  })

  it('should pass for passed production files', async () => {
    await expect(check(yargsv({
      productionOnly: true,
      input: [
        'derp/foo.js'
      ]
    }), [
      'node', 'aegir', 'dependency-check', 'derp/foo.js'
    ], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass-certain-files')
    })).to.eventually.be.fulfilled()
  })

  it('should pass for ignored modules', async () => {
    await expect(check(yargsv({
      ignore: ['execa']
    }), [], {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
    })).to.eventually.be.fulfilled()
  })
})
