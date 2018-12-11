/* eslint-env mocha */
'use strict'

const lintCommits = require('../src/lint-commits')
const expect = require('chai').expect
const path = require('path')
const os = require('os')
const fs = require('fs')
const series = require('async/series')
const child = require('child_process')

function commitFile (directory, name, contents, message, callback) {
  series([
    (cb) => fs.writeFile(path.join(directory, name), contents, cb),
    (cb) => child.exec('git add -A', {
      cwd: directory
    }, cb),
    (cb) => child.exec(`git commit -m "${message}"`, {
      cwd: directory
    }, cb)
  ], callback)
}

const setupProject = (commitMessage = 'chore: initial commit') => {
  const tmpDir = path.join(os.tmpdir(), `test-${Math.random()}`)

  return new Promise((resolve, reject) => {
    series([
      (cb) => fs.mkdir(tmpDir, cb),
      (cb) => child.exec('git init', {
        cwd: tmpDir
      }, cb),
      (cb) => child.exec('git config user.email "you@example.com"', {
        cwd: tmpDir
      }, cb),
      (cb) => child.exec('git config user.name "test"', {
        cwd: tmpDir
      }, cb),
      (cb) => commitFile(tmpDir, 'hello.txt', 'Amazing', 'chore: initial commit', cb),
      (cb) => commitFile(tmpDir, 'goodbye.txt', 'Amazing', commitMessage, cb)
    ], (error) => {
      if (error) {
        return reject(error)
      }

      process.chdir(tmpDir)

      resolve()
    })
  })
}

const commitMessageShouldPassLinting = (commitMessage) => {
  return setupProject(commitMessage)
    .then(() => lintCommits({
      from: 'HEAD~1'
    }))
}

const commitMessageShouldFailLinting = (commitMessage) => {
  return setupProject(commitMessage)
    .then(() => lintCommits({
      from: 'HEAD~1'
    }))
    .then(() => {
      throw new Error('Should have failed!')
    })
    .catch(error => {
      expect(error.message).to.contain('Linting commits HEAD~1..HEAD failed')
    })
}

describe('lint commit messages', () => {
  const cwd = process.cwd()

  after(() => {
    process.chdir(cwd)
  })

  it('passes with good commit messages', function () {
    return commitMessageShouldPassLinting('chore: such a chore')
  })

  it('fails with bad commit messages', function () {
    return commitMessageShouldFailLinting('Ahahallolol!!!11shift+1')
  })
})
