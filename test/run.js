/* eslint-env mocha */

import { createRequire } from 'module'
import os from 'os'
import { execa } from 'execa'
import { expect } from '../utils/chai.js'
import { setUpProject } from './utils/set-up-project.js'

const require = createRequire(import.meta.url)
const bin = require.resolve('../src/index.js')

describe('run', () => {
  if (os.platform() === 'win32') {
    describe.skip('Skipping tests on windows because commands are different', () => {})

    return
  }

  let projectDir = ''

  before(async () => {
    projectDir = await setUpProject('a-monorepo')
  })

  it('should prefix monorepo output with the project name', async function () {
    this.timeout(120 * 1000) // slow ci is slow

    const result = await execa(bin, ['run', 'test'], {
      cwd: projectDir
    })

    expect(result.stdout).to.equal(`
another-workspace-project: npm run test
another-workspace-project: > another-workspace-project@1.0.0 test
another-workspace-project: > echo very test
another-workspace-project: very test

a-workspace-project: npm run test
a-workspace-project: > a-workspace-project@1.0.0 test
a-workspace-project: > echo very test
a-workspace-project: very test`)
  })

  it('should not prefix monorepo output with the project name with --no-prefix', async function () {
    this.timeout(120 * 1000) // slow ci is slow

    const result = await execa(bin, ['run', '--no-prefix', 'test'], {
      cwd: projectDir
    })

    expect(result.stdout).to.equal(`
another-workspace-project: npm run test

> another-workspace-project@1.0.0 test
> echo very test

very test

a-workspace-project: npm run test

> a-workspace-project@1.0.0 test
> echo very test

very test`)
  })

  it('should not prefix monorepo output with the project name with --prefix=false', async function () {
    this.timeout(120 * 1000) // slow ci is slow

    const result = await execa(bin, ['run', '--prefix=false', 'test'], {
      cwd: projectDir
    })

    expect(result.stdout).to.equal(`
another-workspace-project: npm run test

> another-workspace-project@1.0.0 test
> echo very test

very test

a-workspace-project: npm run test

> a-workspace-project@1.0.0 test
> echo very test

very test`)
  })
})
