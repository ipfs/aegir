/* eslint-env mocha */

import { createRequire } from 'module'
import os from 'os'
import { execa } from 'execa'
import { expect } from '../utils/chai.js'
import { setUpProject } from './utils/set-up-project.js'

const require = createRequire(import.meta.url)
const bin = require.resolve('../src/index.js')

describe('exec', () => {
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

    const result = await execa(bin, ['exec', 'ls'], {
      cwd: projectDir
    })

    expect(result.stdout).to.equal(`
another-workspace-project: > ls
another-workspace-project: package.json
another-workspace-project: src
another-workspace-project: tsconfig.json
another-workspace-project: typedoc.json

a-workspace-project: > ls
a-workspace-project: package.json
a-workspace-project: src
a-workspace-project: tsconfig.json
a-workspace-project: typedoc.json`)
  })

  it('should not prefix monorepo output with the project name with --no-prefix', async function () {
    this.timeout(120 * 1000) // slow ci is slow

    const result = await execa(bin, ['exec', '--no-prefix', 'ls'], {
      cwd: projectDir
    })

    expect(result.stdout).to.equal(`
another-workspace-project: > ls
package.json
src
tsconfig.json
typedoc.json

a-workspace-project: > ls
package.json
src
tsconfig.json
typedoc.json`)
  })

  it('should not prefix monorepo output with the project name with --prefix=false', async function () {
    this.timeout(120 * 1000) // slow ci is slow

    const result = await execa(bin, ['exec', '--prefix=false', 'ls'], {
      cwd: projectDir
    })

    expect(result.stdout).to.equal(`
another-workspace-project: > ls
package.json
src
tsconfig.json
typedoc.json

a-workspace-project: > ls
package.json
src
tsconfig.json
typedoc.json`)
  })
})
