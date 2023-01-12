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

    before(async function () {
      this.timeout(120 * 1000) // slow ci is slow
      projectDir = await setUpProject('an-esm-project')

      await execa(bin, ['docs', '--publish', 'false'], {
        cwd: projectDir
      })
    })

    it('should document an esm project', async () => {
      const module = await import(`file://${projectDir}/src/index.js`)
      const exports = [...Object.keys(module), 'AnExportedInterface', 'ExportedButNotInExports', 'UsedButNotExported']
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      exports.forEach(key => {
        expect(typedocUrls).to.have.property(key)
      })
    })

    it('should include definitions for classes exported but not in file in export map', async function () {
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      expect(typedocUrls).to.have.property('ExportedButNotInExports')
    })

    it('should include definitions for classes used but not exported', async function () {
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      expect(typedocUrls).to.have.property('UsedButNotExported')
    })

    it('should exclude definitions from node_modules', async function () {
      expect(fs.existsSync(join(projectDir, '.docs', 'modules', '_internal_.EventEmitter.html'))).to.be.false('included type from node_modules/@types/node')
    })
  })

  describe('simple ts project', () => {
    let projectDir = ''

    before(async function () {
      this.timeout(120 * 1000) // slow ci is slow
      projectDir = await setUpProject('a-ts-project')

      await execa(bin, ['build'], {
        cwd: projectDir
      })
      await execa(bin, ['docs', '--publish', 'false'], {
        cwd: projectDir
      })
    })

    it('should document a ts project', async () => {
      const module = await import(`file://${projectDir}/dist/src/index.js`)
      const exports = Object.keys(module)
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      exports.forEach(key => {
        expect(typedocUrls).to.have.property(key)
      })
    })

    it('should include definitions for classes exported but not in file in export map', async function () {
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      expect(typedocUrls).to.have.property('ExportedButNotInExports')
    })

    it('should include definitions for classes used but not exported', async function () {
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      expect(typedocUrls).to.have.property('UsedButNotExported')
    })

    it('should exclude definitions from node_modules', async function () {
      expect(fs.existsSync(join(projectDir, '.docs', 'modules', '_internal_.EventEmitter.html'))).to.be.false('included type from node_modules/@types/node')
    })

    it('should include definitions for enums', async function () {
      const typedocUrls = await fs.readJSON(join(projectDir, 'dist', 'typedoc-urls.json'))

      expect(typedocUrls).to.have.property('AnEnum')
    })
  })

  describe('monorepo project', () => {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('a-monorepo')
    })

    it('should document a monorepo project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa(bin, ['docs', '--publish', 'false'], {
        cwd: projectDir
      })

      expect(fs.existsSync(join(projectDir, '.docs'))).to.be.true()

      const module = await import(`file://${projectDir}/packages/a-workspace-project/src/index.js`)
      const exports = [...Object.keys(module), 'AnExportedInterface', 'ExportedButNotInExports']
      const typedocUrls = await fs.readJSON(join(projectDir, 'packages/a-workspace-project/dist', 'typedoc-urls.json'))

      exports.forEach(key => {
        expect(typedocUrls).to.have.property(key)
      })
    })
  })
})
