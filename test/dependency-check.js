/* eslint-env mocha */
'use strict'

const check = require('../src/dependency-check')
const { expect } = require('../utils/chai')
const path = require('path')

describe('dependency check', () => {
  it('should fail for missing deps', async () => {
    await expect(check(undefined, {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
    })).to.eventually.rejectedWith('execa')
  })

  it('should pass when theres no missing deps', async () => {
    await expect(check(undefined, {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
    })).to.eventually.fulfilled()
  })

  it('should forward options', async () => {
    await expect(check({ _: [], '--': ['--unused'] }, {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
    })).to.eventually.rejectedWith('Modules in package.json not used in code: pico')
  })
})
