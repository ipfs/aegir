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
const tag = require('./tag')
const contributors = require('./contributors')
const github = require('./github')
const publish = require('./publish')
const push = require('./push')

function release (opts) {
  const tasks = new Listr([
    {
      title: 'Lint',
      task: lint,
      enabled: (ctx) => ctx.lint
    },
    {
      title: 'Test',
      task: (ctx) => test.run(ctx),
      enabled: (ctx) => ctx.test
    },
    {
      title: 'Bump Version',
      task: bump,
      enabled: (ctx) => ctx.bump
    },
    {
      title: 'Build',
      task: (ctx) => build(ctx),
      enabled: (ctx) => ctx.build
    },
    {
      title: 'Update Contributors',
      task: contributors,
      enabled: (ctx) => ctx.contributors
    },
    {
      title: 'Generate Changelog',
      task: changelog,
      enabled: (ctx) => ctx.changelog
    },
    {
      title: 'Commit to Git',
      task: commit,
      enabled: (ctx) => ctx.commit
    },
    {
      title: 'Tag release',
      task: tag,
      enabled: (ctx) => ctx.tag
    },
    {
      title: 'Push to GitHub',
      task: push,
      enabled: (ctx) => ctx.push
    },
    {
      title: 'Generate GitHub Release',
      task: github,
      enabled: (ctx) => ctx.ghrelease
    },
    {
      title: 'Publish documentation',
      task: () => docs,
      enabled: (ctx) => ctx.docs
    },
    {
      title: 'Publish to npm',
      task: publish,
      enabled: (ctx) => ctx.publish
    }
  ], utils.getListrConfig())

  return releaseChecks(opts).then(() => tasks.run(opts))
}

module.exports = release
