/* eslint-env mocha */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { premove as del } from 'premove/sync'
import { defaultLintConfig } from '../src/config/default-lint-config.js'
import { loadUserConfig } from '../src/config/user.js'
import lint from '../src/lint.js'
import { expect } from '../utils/chai.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMP_FOLDER = path.join(__dirname, '../node_modules/.temp-test')

/**
 * @param {{ [s: string]: any; } | ArrayLike<any>} project
 */
const setupProject = async (project) => {
  const tmpDir = path.join(TEMP_FOLDER, `test-${Math.random()}`)
  await fs.promises.mkdir(tmpDir)
  for (const [name, content] of Object.entries(project)) {
    await fs.promises.writeFile(path.join(tmpDir, name), content)
  }
  process.chdir(tmpDir)
}

/**
 * @param {never[]} deps
 */
const setupProjectWithDeps = deps => setupProject({
  'package.json': JSON.stringify({
    name: 'my-project',
    dependencies: deps
  })
})

/**
 * @param {{ [s: string]: any; } | ArrayLike<any>} project
 */
const projectShouldPassLint = async (project) => {
  const userConfig = await loadUserConfig()
  await setupProject(project)
  await lint.run({
    fileConfig: userConfig,
    debug: false,
    ...defaultLintConfig
  })
}

/**
 * @param {{ [s: string]: any; } | ArrayLike<any>} project
 */
const projectShouldFailLint = async (project) => {
  const userConfig = await loadUserConfig()
  await setupProject(project)
  let failed = false
  try {
    await lint.run({
      fileConfig: userConfig,
      debug: false,
      ...defaultLintConfig
    })
  } catch (/** @type {any} */ error) {
    failed = true
    expect(error.message).to.contain('Lint errors')
  }

  expect(failed).to.equal(true, 'Should have failed!')
}

describe('lint', () => {
  const cwd = process.cwd()
  before(() => {
    fs.mkdirSync(TEMP_FOLDER, { recursive: true })
  })

  after(() => {
    process.chdir(cwd)
    del(TEMP_FOLDER)
  })

  it('lint itself (aegir)', async function () {
    this.timeout(120 * 1000) // slow ci is slow
    const userConfig = await loadUserConfig()
    return lint.run({
      fileConfig: userConfig,
      debug: false,
      fix: false,
      silent: true,
      files: defaultLintConfig.files
    })
  })

  it('should pass in user defined path globs', async () => {
    const dir = `test-${Date.now()}`
    const userConfig = await loadUserConfig()
    return setupProjectWithDeps([])
      .then(() => {
        // Directory not included in the default globs

        fs.mkdirSync(dir)
        fs.writeFileSync(`${dir}/test-pass.js`, 'export default {}\n')
      })
      .then(() => lint.run({
        fileConfig: userConfig,
        debug: false,
        fix: false,
        silent: true,
        files: [`${dir}/*.js`]
      }))
  })

  it('should fail in user defined path globs', async () => {
    const dir = `test-${Date.now()}`
    const userConfig = await loadUserConfig()
    await setupProjectWithDeps([])
    // Directory not included in the default globs

    fs.mkdirSync(dir)
    fs.writeFileSync(`${dir}/test-fail.js`, '() .> {')

    await expect(lint.run({
      fileConfig: userConfig,
      debug: false,
      fix: false,
      silent: true,
      files: [`${dir}/*.js`]
    }))
      .to.eventually.be.rejectedWith('Lint errors')
  })

  it('should lint ts and js with different parsers rules', async () => {
    process.chdir(path.join(__dirname, './fixtures/js+ts/'))
    const userConfig = await loadUserConfig()
    await lint.run({
      fileConfig: userConfig,
      debug: false,
      ...defaultLintConfig
    })
  })

  it('should pass if no .eslintrc found and does not follows ipfs eslint rules', async () => {
    await projectShouldFailLint({
      'package.json': JSON.stringify({
        name: 'no-config-fail',
        main: 'index.js'
      }),
      'index.js': '"use strict"\nmodule.exports = () => {}\n'
    })
  })

  it('should pass if no .eslintrc found but code follows ipfs eslint rules', async () => {
    await projectShouldPassLint({
      'package.json': JSON.stringify({
        name: 'no-config-fail',
        main: 'index.js'
      }),
      'index.js': 'module.exports = () => {}\n'
    })
  })

  it('should fail if .eslintrc overules ipfs and code does not follow it', async () => {
    await projectShouldFailLint({
      'package.json': JSON.stringify({
        name: 'with-config-fail',
        main: 'index.js',
        type: 'commonjs'
      }),
      'index.js': '\'use strict\'\nmodule.exports = () => {}\n',
      '.eslintrc': JSON.stringify({
        extends: 'ipfs',
        rules: {
          quotes: [
            'error',
            'double'
          ]
        }
      })
    })
  })

  it('should pass if .eslintrc overules ipfs and code follows it', async () => {
    await projectShouldPassLint({
      'package.json': JSON.stringify({
        name: 'with-config-fail',
        main: 'index.js',
        type: 'commonjs'
      }),
      'index.js': '"use strict"\nmodule.exports = () => {}\n',
      '.eslintrc': JSON.stringify({
        extends: 'ipfs',
        rules: {
          quotes: [
            'error',
            'double'
          ]
        }
      })
    })
  })
})
