'use strict'

const Listr = require('listr')

const lint = require('../lint')
const test = require('../test')
const build = require('../build')
const utils = require('../utils')
const docs = require('../docs')

const releaseChecks = require('./prerelease')
const bump = require('./bump')
const changelog = require('./changelog')
const commit = require('./commit')
const contributors = require('./contributors')
const github = require('./github')
const publish = require('./publish')
const push = require('./push')

function release (opts) {
  // enable publishing for docs
  opts.publish = true

  const tasks = new Listr([{
    title: 'Lint',
    task: lint,
    enabled: (ctx) => ctx.lint
  }, {
    title: 'Test',
    task: () => test.run,
    enabled: (ctx) => ctx.test
  }, {
    title: 'Build',
    task: () => build,
    enabled: (ctx) => ctx.build
  }, {
    title: 'Update Contributors',
    task: contributors,
    enabled: (ctx) => ctx.contributors
  }, {
    title: 'Bump Version',
    task: bump,
    enabled: (ctx) => ctx.bump
  }, {
    title: 'Generate Changelog',
    task: changelog,
    enabled: (ctx) => ctx.changelog
  }, {
    title: 'Commit to Git',
    task: commit
  }, {
    title: 'Push to GitHub',
    task: push
  }, {
    title: 'Generate GitHub Release',
    task: github,
    enabled: (ctx) => ctx.ghrelease
  }, {
    title: 'Publish documentation',
    task: () => docs,
    enabled: (ctx) => ctx.docs
  }, {
    title: 'Publish to npm',
    task: publish,
    enabled: (ctx) => ctx.publish
  }], utils.getListrConfig())

  return releaseChecks(opts).then(() => tasks.run(opts))
}

module.exports = release
