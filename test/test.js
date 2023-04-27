/* eslint-env mocha */

import os from 'os'
import { execa } from 'execa'
import { setUpProject } from './utils/set-up-project.js'

describe('test', () => {
  if (os.platform() === 'win32') {
    describe.skip('Skipping tests on windows because symlinking works differently', () => {})

    return
  }

  describe('esm', function () {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('an-esm-project')
    })

    it('should test an esm project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa('npm', ['test'], {
        cwd: projectDir
      })
    })
  })

  describe('ts', function () {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('a-ts-project')
    })

    it('should test a ts project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa('npm', ['test'], {
        cwd: projectDir
      })
    })
  })
})
