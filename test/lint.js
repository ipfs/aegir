/* eslint-env mocha */
'use strict'

const lint = require('../src/lint')
const { expect } = require('../utils/chai')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const TEMP_FOLDER = path.join(__dirname, '../node_modules/.temp-test')
const setupProjectWithDeps = async (deps) => {
  const tmpDir = path.join(TEMP_FOLDER, `test-${Math.random()}`)
  await fs.promises.mkdir(tmpDir)
  await fs.promises.writeFile(path.join(tmpDir, 'package.json'), JSON.stringify({
    name: 'my-project',
    dependencies: deps
  }))
  process.chdir(tmpDir)
}
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

describe('lint', () => {
  const cwd = process.cwd()
  before(() => {
    fs.mkdirSync(TEMP_FOLDER, { recursive: true })
  })

  after(() => {
    process.chdir(cwd)
    rimraf.sync(TEMP_FOLDER)
  })

  it('lint itself (aegir)', function () {
    this.timeout(20 * 1000) // slow ci is slow
    return lint({ fix: false })
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
      .then(() => lint())
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

    await expect(lint()).to.eventually.be.rejectedWith('Lint errors')
  })
})
