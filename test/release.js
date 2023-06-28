/* eslint-env mocha */

import { execa } from 'execa'
import { expect } from '../utils/chai.js'
import { setUpProject } from './utils/set-up-project.js'

describe('release', () => {
  describe('regular repo', function () {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('an-esm-project')
    })

    it('should release an esm project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      const output = await execa('npm', ['run', 'release', '--', '--', '--dry-run'], {
        cwd: projectDir,
        env: {
          ...process.env,
          GITHUB_ACTIONS: '',
          CI: ''
        }
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

      const output = await execa('npm', ['run', 'release', '--', '--', '--dry-run'], {
        cwd: projectDir,
        env: {
          ...process.env,
          GITHUB_ACTIONS: '',
          CI: ''
        }
      })

      console.info('output.stdout', output.stdout) // eslint-disable-line no-console
      console.info('output.stderr', output.stderr) // eslint-disable-line no-console
      expect(output.stdout).to.include('Published release 1.0.0 on default channel')
    })
  })
})
