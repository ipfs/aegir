/* eslint-env mocha */

import { createRequire } from 'module'
import { join } from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { expect } from '../utils/chai.js'
import { setUpProject } from './utils/set-up-project.js'

const require = createRequire(import.meta.url)
const bin = require.resolve('../src/index.js')

describe('build', () => {
  describe('esm', () => {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('an-esm-project')
    })

    it('should build an esm project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa(bin, ['build'], {
        cwd: projectDir
      })

      expect(fs.existsSync(join(projectDir, 'dist', 'index.min.js'))).to.be.true()
    })
  })

  describe('ts', () => {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('a-ts-project')
    })

    it('should build a typescript project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa(bin, ['build'], {
        cwd: projectDir
      })

      expect(fs.existsSync(join(projectDir, 'dist', 'index.min.js'))).to.be.true()
    })
  })

  describe('multiple output files', () => {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('a-multiple-output-project')
    })

    it('should build a typescript project with multiple outputs', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa(bin, ['build'], {
        cwd: projectDir
      })

      expect(fs.existsSync(join(projectDir, 'dist', 'index.js'))).to.be.true()
      expect(fs.existsSync(join(projectDir, 'dist', 'sw.js'))).to.be.true()
    })
  })
})
