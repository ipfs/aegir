/* eslint-env mocha */
'use strict'

const { check, defaultInput } = require('../src/dependency-check')
const { expect } = require('../utils/chai')
const path = require('path')
const merge = require('merge-options')

// returns an object that looks like the yargs input
const yargsv = (overrides = {}) => {
  const argv = {
    _: [
      'dependency-check'
    ],
    input: defaultInput,
    ignore: []
  }

  return merge(argv, overrides)
}

/**
 *
 * @param {string[] | string} input
 */
const argv = (input = []) => {
  return [
    'node', 'aegir', 'dependency-check'
  ].concat(input)
}

describe('dependency check', () => {
  it('should fail for missing deps', async () => {
    await expect(check(yargsv(), argv(), {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
    })).to.eventually.be.rejectedWith('execa')
  })

  it('should pass when there are no missing deps', async () => {
    await expect(check(yargsv(), argv(), {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
    })).to.eventually.be.fulfilled()
  })

  it('should forward options', async () => {
    await expect(check(yargsv({ '--': ['--unused'] }), argv(), {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
    })).to.eventually.be.rejectedWith('Modules in package.json not used in code: pico')
  })

  it('should fail for missing production deps', async () => {
    await expect(check(yargsv({ productionOnly: true }), argv(), {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail-prod')
    })).to.eventually.be.rejectedWith('execa')
  })

  it('should pass for passed files', async () => {
    const file = 'derp/foo.js'

    await expect(check(yargsv({
      input: [file]
    }), argv(file), {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass-certain-files')
    })).to.eventually.be.fulfilled()
  })

  it('should pass for passed production files', async () => {
    const file = 'derp/foo.js'

    await expect(check(yargsv({
      productionOnly: true,
      input: [file]
    }), argv(file), {
      cwd: path.join(__dirname, 'fixtures/dependency-check/pass-certain-files')
    })).to.eventually.be.fulfilled()
  })

  it('should pass for ignored modules', async () => {
    await expect(check(yargsv({
      ignore: ['execa']
    }), argv(), {
      cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
    })).to.eventually.be.fulfilled()
  })

  it('should pass for modules used in .aegir.js', async () => {
    await expect(check(yargsv({
      '--': ['--unused']
    }), argv(['--', '--unused']), {
      cwd: path.join(__dirname, 'fixtures/dependency-check/with-aegir-config')
    })).to.eventually.be.fulfilled()
  })
})
