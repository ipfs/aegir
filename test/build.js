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

describe('build', () => {
  describe('esm', () => {
    let projectDir = ''

    before(async () => {
      projectDir = tempy.directory()

      await fs.copy(join(__dirname, 'fixtures', 'projects', 'an-esm-project'), projectDir)
    })

    it('should build an esm project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa(bin, ['build'], {
        cwd: projectDir
      })

      expect(fs.existsSync(join(projectDir, 'dist', 'index.min.js'))).to.be.true()
    })
  })
})
