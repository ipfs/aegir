/* eslint-env mocha */

import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import { expect } from '../utils/chai.js'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bin = require.resolve('../src/index.js')
const isWindows = process.platform === 'win32'

describe('document check', () => {
  // Skip tests on windows until https://github.com/bbc/typescript-docs-verifier/issues/26 is resolved
  if (!isWindows) {
    it('should fail for errant typescript in docs', async () => {
      const cwd = path.join(__dirname, 'fixtures/document-check/ts-fail')

      await expect(execa(bin, ['doc-check', '--inputFiles', `${cwd}/*.md`, '--tsConfigPath', `${cwd}`]))
        .to.eventually.be.rejected()
        .with.property('stdout')
        .that.include('Error compiling example code block 1')
    })

    it('should pass for correct typescript in docs', async () => {
      const cwd = path.join(__dirname, 'fixtures/document-check/pass')

      await expect(execa(bin, ['doc-check', '--inputFiles', `${cwd}/*.md`])).to.eventually.be.fulfilled()
    })

    it('should fail for missing tsconfig.json', async () => {
      const cwd = path.join(__dirname, 'fixtures/document-check/tsconfig-fail')

      await expect(execa(bin, ['doc-check', '--inputFiles', `${cwd}/*.md`, '--tsConfigPath', `${cwd}`]))
        .to.eventually.be.rejected()
        .with.property('stderr')
        .that.include('no such file or directory')
    })

    it('should not run out of memory for large number of ts code blocks', async () => {
      const cwd = path.join(__dirname, 'fixtures/document-check/pass-large-blocks')

      await expect(execa(bin, ['doc-check', '--inputFiles', `${cwd}/*.md`, '--tsConfigPath', `${cwd}`]))
        .to.eventually.be.fulfilled()
    })
  }
})
