/* eslint-env mocha */

import { expect } from '../utils/chai.js'
import { execa } from 'execa'
import fs from 'fs-extra'
import { join } from 'path'
import { createRequire } from 'module'
import { setUpProject } from './utils/set-up-project.js'

const require = createRequire(import.meta.url)
const bin = require.resolve('../src/index.js')

describe('docs', () => {
  describe('simple esm project', () => {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('an-esm-project')
    })

    it('should document an esm project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa(bin, ['docs'], {
        cwd: projectDir
      })

      const module = await import(projectDir + '/src/index.js')
      const exports = [...Object.keys(module), 'AnExportedInterface', 'ExportedButNotInExports']
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      exports.forEach(key => {
        expect(typedocUrls).to.have.property(key)
      })
    })
  })

  describe('simple ts project', () => {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('a-ts-project')
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
      const exports = [...Object.keys(module), 'AnExportedInterface', 'ExportedButNotInExports']
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      exports.forEach(key => {
        expect(typedocUrls).to.have.property(key)
      })
    })
  })
})
