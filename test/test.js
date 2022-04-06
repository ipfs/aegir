/* eslint-env mocha */

import { execa } from 'execa'
import { copy } from 'fs-extra'
import path, { join } from 'path'
import tempy from 'tempy'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bin = require.resolve('../src/index.js')

describe('test', () => {
  describe('esm', function () {
    let projectDir = ''

    before(async () => {
      projectDir = tempy.directory()

      await copy(join(__dirname, 'fixtures', 'esm', 'an-esm-project'), projectDir)
    })

    it('should test an esm project', async function () {
      this.timeout(60 * 1000) // slow ci is slow

      await execa(bin, ['test'], {
        cwd: projectDir
      })
    })
  })
})
