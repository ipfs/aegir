/* eslint-env mocha */

import { expect } from '../utils/chai.js'
import { execa } from 'execa'
import fs from 'fs-extra'
import path, { join } from 'path'
import tempy from 'tempy'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bin = require.resolve('../src/index.js')

describe('docs', () => {
  describe('simple esm project', () => {
    let projectDir = ''

    before(async () => {
      projectDir = tempy.directory()

      await fs.copy(join(__dirname, 'fixtures', 'projects', 'an-esm-project'), projectDir)
    })

    it('should document an esm project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa(bin, ['docs'], {
        cwd: projectDir
      })

      const module = await import(projectDir + '/src/index.js')
      const exports = [...Object.keys(module), 'AnExportedInterface']
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      exports.forEach(key => {
        expect(typedocUrls).to.have.property(key)
      })
    })
  })

  describe('simple ts project', () => {
    let projectDir = ''

    before(async () => {
      projectDir = tempy.directory()

      await fs.copy(join(__dirname, 'fixtures', 'projects', 'a-ts-project'), projectDir)
    })

    it('should document a ts project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa(bin, ['build'], {
        cwd: projectDir
      })
      await execa(bin, ['docs'], {
        cwd: projectDir
      })

      const module = await import(projectDir + '/dist/src/index.js')
      const exports = [...Object.keys(module), 'AnExportedInterface']
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      exports.forEach(key => {
        expect(typedocUrls).to.have.property(key)
      })
    })
  })
})
