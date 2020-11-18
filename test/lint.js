/* eslint-env mocha */
'use strict'

const lint = require('../src/lint')
const { expect } = require('../utils/chai')
const path = require('path')
const fs = require('fs')
const { premove: del } = require('premove/sync')

const TEMP_FOLDER = path.join(__dirname, '../node_modules/.temp-test')

const setupProject = async (project) => {
  const tmpDir = path.join(TEMP_FOLDER, `test-${Math.random()}`)
  await fs.promises.mkdir(tmpDir)
  for (const [name, content] of Object.entries(project)) {
    await fs.promises.writeFile(path.join(tmpDir, name), content)
  }
  process.chdir(tmpDir)
}

const setupProjectWithDeps = deps => setupProject({
  'package.json': JSON.stringify({
    name: 'my-project',
    dependencies: deps
  })
})

const dependenciesShouldPassLinting = (deps) => {
  return setupProjectWithDeps(deps)
    .then(() => lint())
}

const dependenciesShouldFailLinting = (deps) => {
  return setupProjectWithDeps(deps)
    .then(() => lint())
    .then(() => {
      throw new Error('Should have failed!')
    })
    .catch(error => {
      expect(error.message).to.contain('Dependency version errors')
    })
}

const projectShouldPassLint = async (project) => {
  await setupProject(project)
  await lint()
}

const projectShouldFailLint = async (project) => {
  await setupProject(project)
  let failed = false
  try {
    await lint({ silent: true })
  } catch (error) {
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

  it('lint itself (aegir)', function () {
    this.timeout(20 * 1000) // slow ci is slow
    return lint({ fix: false, silent: true })
  })

  it('succeeds when package.json contains dependencies with good versions', function () {
    return dependenciesShouldPassLinting({
      'some-unstable-dep': '~0.0.1',
      'some-dev-dep': '^0.1.0',
      'some-other-dev-dep': '~0.1.0',
      'some-stable-dep': '^1.0.0',
      'some-pinned-dep': '1.0.0'
    })
  })

  it('fails when package.json contains dependencies with carets for unstable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '^0.0.1'
    })
  })

  it('fails when package.json contains dependencies with <= for unstable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '<=0.0.1'
    })
  })

  it('fails when package.json contains dependencies with > for unstable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '>0.0.1'
    })
  })

  it('fails when package.json contains dependencies with < for unstable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '<0.0.1'
    })
  })

  it('fails when package.json contains dependencies with >= for unstable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '>=0.0.1'
    })
  })

  it('fails when package.json contains dependencies with <= for development deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '<=0.1.0'
    })
  })

  it('fails when package.json contains dependencies with > for development deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '>0.1.0'
    })
  })

  it('fails when package.json contains dependencies with < for development deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '<0.1.0'
    })
  })

  it('fails when package.json contains dependencies with >= for development deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '>=0.1.0'
    })
  })

  it('fails when package.json contains dependencies with tildes for stable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '~1.0.0'
    })
  })

  it('fails when package.json contains dependencies with > for stable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '>1.0.0'
    })
  })

  it('fails when package.json contains dependencies with < for stable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '<1.0.0'
    })
  })

  it('should pass in user defined path globs', () => {
    return setupProjectWithDeps([])
      .then(() => {
        // Directory not included in the default globs
        const dir = `test-${Date.now()}`

        fs.mkdirSync(dir)
        fs.writeFileSync(`${dir}/test-pass.js`, '\'use strict\'\n\nmodule.exports = {}\n')
        fs.writeFileSync(
          '.aegir.js',
          `module.exports = { lint: { files: ['${dir}/*.js'] } }`
        )
      })
      .then(() => lint({ silent: true }))
  })

  it('should fail in user defined path globs', async () => {
    await setupProjectWithDeps([])
    // Directory not included in the default globs
    const dir = `test-${Date.now()}`

    fs.mkdirSync(dir)
    fs.writeFileSync(`${dir}/test-fail.js`, '() .> {')
    fs.writeFileSync(
      '.aegir.js',
          `module.exports = { lint: { files: ['${dir}/*.js'] } }`
    )

    await expect(lint({ silent: true })).to.eventually.be.rejectedWith('Lint errors')
  })

  it('should lint ts and js with different parsers rules', async () => {
    process.chdir(path.join(__dirname, './fixtures/js+ts/'))
    await lint()
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
      'index.js': '\'use strict\'\nmodule.exports = () => {}\n'
    })
  })

  it('should fail if .eslintrc overules ipfs and code does not follow it', async () => {
    await projectShouldFailLint({
      'package.json': JSON.stringify({
        name: 'with-config-fail',
        main: 'index.js'
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
        main: 'index.js'
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
