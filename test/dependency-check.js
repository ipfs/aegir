/* eslint-env mocha */

import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import { expect } from '../utils/chai.js'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bin = require.resolve('../src/index.js')

describe('dependency check', () => {
  it('should fail for missing deps', async () => {
    await expect(
      execa(bin, ['dependency-check', '-u', 'false'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/fail')
      })
    ).to.eventually.be.rejectedWith('execa')
  })

  it('should fail for missing deps in an esm project', async () => {
    await expect(
      execa(bin, ['dependency-check', '-u', 'false'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/esm-fail')
      })
    ).to.eventually.be.rejected()
      .with.property('message')
      .that.include('execa')
      .and.include('pico')
  })

  it('should fail for missing deps in an ts project', async () => {
    await expect(
      execa(bin, ['dependency-check', '-u', 'false'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/ts-fail')
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

  it('should pass when there are no missing deps in an ts project', async () => {
    await expect(
      execa(bin, ['dependency-check'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/ts-pass')
      })
    ).to.eventually.be.fulfilled()
  })

  it('should check unused', async () => {
    await expect(
      execa(bin, ['dependency-check'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/fail-unused')
      })
    ).to.eventually.be.rejectedWith('pico')
  })

  /**
   * depcheck removed this option as it caused too many false positives
   */
  it.skip('should fail for missing production deps', async () => {
    await expect(
      execa(bin, ['dependency-check', '-p'], {
        cwd: path.join(__dirname, 'fixtures/dependency-check/fail-prod')
      })
    ).to.eventually.be.rejectedWith('execa')
  })

  /**
   * not supporting depchecking individual files
   */
  it.skip('should pass for passed files', async () => {
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

  /**
   * not supporting depchecking individual files
   */
  it.skip('should pass for passed production files', async () => {
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
      execa(bin, ['dependency-check', '-u', 'false'], {
        cwd: path.join(
          __dirname,
          'fixtures/dependency-check/with-aegir-config'
        )
      })
    ).to.eventually.be.fulfilled()
  })
})
