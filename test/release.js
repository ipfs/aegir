/* eslint-env mocha */

import { execa } from 'execa'
import { expect } from '../utils/chai.js'
import { setUpProject } from './utils/set-up-project.js'

describe.only('release', () => {
  describe('regular repo', function () {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('an-esm-project')
    })

    it('should release an esm project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      const args = []

      // necessary for CI
      if (process.env.GITHUB_HEAD_REF != null) {
        args.push('--branches', process.env.GITHUB_HEAD_REF)
      }

      const output = await execa('npm', ['run', 'release', '--', '--', '--dry-run', '--no-ci', ...args], {
        cwd: projectDir
      })

      console.info('output.stdout', output.stdout) // eslint-disable-line no-console
      console.info('output.stderr', output.stderr) // eslint-disable-line no-console
      expect(output.stdout).to.include('Published release 1.0.0 on default channel')
    })
  })

  describe('monorepo', function () {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('a-monorepo')
    })

    it('should release a monorepo project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      const args = []

      // necessary for CI
      if (process.env.GITHUB_HEAD_REF != null) {
        args.push('--branches', process.env.GITHUB_HEAD_REF)
      }

      const output = await execa('npm', ['run', 'release', '--', '--', '--dry-run', '--no-ci', ...args], {
        cwd: projectDir
      })

      console.info('output.stdout', output.stdout) // eslint-disable-line no-console
      console.info('output.stderr', output.stderr) // eslint-disable-line no-console
      expect(output.stdout).to.include('Published release 1.0.0 on default channel')
    })
  })
})
