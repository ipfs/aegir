/* eslint-env mocha */
'use strict'

const lint = require('../src/lint')
const expect = require('chai').expect
const path = require('path')
const os = require('os')
const fs = require('fs')
const series = require('async/series')

const setupProjectWithDeps = (deps) => {
  const tmpDir = path.join(os.tmpdir(), `test-${Math.random()}`)

  return new Promise((resolve, reject) => {
    series([
      (cb) => fs.mkdir(tmpDir, cb),
      (cb) => fs.writeFile(path.join(tmpDir, 'package.json'), JSON.stringify({
        name: 'my-project',
        dependencies: deps
      }), cb)
    ], (error) => {
      if (error) {
        return reject(error)
      }

      process.chdir(tmpDir)

      resolve()
    })
  })
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

  after(() => {
    process.chdir(cwd)
  })

  it('passes', function () {
    // slow ci is slow, appveyor is even slower...
    this.timeout(5000)
    return lint({
      fix: false
    })
  })

  it('succeeds when package.json contains dependencies with good versions', function () {
    return dependenciesShouldPassLinting({
      'some-unstable-dep': '~0.0.1',
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

  it('fails when package.json contains dependencies with <= for unstable deps', function () {
    return dependenciesShouldFailLinting({
      'some-dep': '<=0.0.1'
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
})
