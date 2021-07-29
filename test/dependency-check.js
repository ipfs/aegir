/* eslint-env mocha */
'use strict'

const { expect } = require('../utils/chai')
const path = require('path')
const bin = require.resolve('../')
const execa = require('execa')

describe('dependency check', () => {
  it('should fail for missing deps', async () => {
    await expect(
      execa(bin, ['dependency-check'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
      })
    ).to.eventually.be.rejectedWith('execa')
  })

  it('should fail for missing deps in an esm project', async () => {
    await expect(
      execa(bin, ['dependency-check'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/esm-fail')
      })
    ).to.eventually.be.rejected()
      .with.property('message')
      .that.include('execa')
      .and.include('pico')
  })

  it('should pass when there are no missing deps', async () => {
    await expect(
      execa(bin, ['dependency-check'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
      })
    ).to.eventually.be.fulfilled()
  })

  it('should pass when there are no missing deps in an esm project', async () => {
    await expect(
      execa(bin, ['dependency-check'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/esm-pass')
      })
    ).to.eventually.be.fulfilled()
  })

  it('should forward options', async () => {
    await expect(
      execa(bin, ['dependency-check', '--', '--unused'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/pass')
      })
    ).to.eventually.be.rejectedWith(
      'Modules in package.json not used in code: pico'
    )
  })

  it('should fail for missing production deps', async () => {
    await expect(
      execa(bin, ['dependency-check', '-p'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/fail-prod')
      })
    ).to.eventually.be.rejectedWith('execa')
  })

  it('should pass for passed files', async () => {
    const file = 'derp/foo.js'

    await expect(
      execa(bin, ['dependency-check', file], {
        cwd: path.join(
          __dirname,
          'fixtures/dependency-check/pass-certain-files'
        )
      }
      )
    ).to.eventually.be.fulfilled()
  })

  it('should pass for passed production files', async () => {
    const file = 'derp/foo.js'

    await expect(
      execa(bin, ['dependency-check', file, '-p'], {
        cwd: path.join(
          __dirname,
          'fixtures/dependency-check/pass-certain-files'
        )
      }
      )
    ).to.eventually.be.fulfilled()
  })

  it('should pass for ignored modules', async () => {
    await expect(
      execa(bin, ['dependency-check', '-i', 'execa'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
      }
      )
    ).to.eventually.be.fulfilled()
  })

  it('should pass for modules used in .aegir.js', async () => {
    await expect(
      execa(bin, ['dependency-check', '--', '--unused'], {
        cwd: path.join(
          __dirname,
          'fixtures/dependency-check/with-aegir-config'
        )
      }
      )
    ).to.eventually.be.fulfilled()
  })
})
