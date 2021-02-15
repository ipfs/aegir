'use strict'

const Listr = require('listr')

const lint = require('../lint')
const test = require('../test')
const build = require('../build')
const docs = require('../docs')
const { userConfig } = require('./../config/user')

const releaseChecks = require('./prerelease')
const bump = require('./bump')
const changelog = require('./changelog')
const commit = require('./commit')
const tag = require('./tag')
const contributors = require('./contributors')
const github = require('./github')
const publish = require('./publish')
const push = require('./push')

/**
 * @typedef {import('./../types').ReleaseOptions} ReleaseOptions
 * @typedef {import('./../types').GlobalOptions} GlobalOptions
 */

/**
 * Release command
 *
 * @param {GlobalOptions & ReleaseOptions} opts
 */
async function release (opts) {
  const globalOptions = { debug: opts.debug, tsRepo: opts.tsRepo }
  const tasks = new Listr(
    [
      {
        title: 'Lint',
        task: () => lint({ ...globalOptions, ...userConfig.lint, silent: true }),
        enabled: (ctx) => ctx.lint
      },
      {
        title: 'Test',
        task: () =>
          test.run(
            {
              ...globalOptions,
              ...userConfig.test
            },
            {
              stdio: 'ignore'
            }
          ),
        enabled: (ctx) => ctx.test
      },
      {
        title: 'Bump Version',
        task: (ctx, task) =>
          bump({ type: opts.type, preid: opts.preid }, task),
        enabled: (ctx) => ctx.bump
      },
      {
        title: 'Build',
        task: () => build({
          ...globalOptions,
          ...userConfig.build
        }),
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
        task: () => github({ ghtoken: opts.ghtoken }),
        enabled: (ctx) => ctx.ghrelease
      },
      {
        title: 'Publish documentation',
        task: () => docs,
        enabled: (ctx) => ctx.docs
      },
      {
        title: 'Publish to npm',
        task: (ctx, task) => publish(opts, task),
        enabled: (ctx) => ctx.publish
      }
    ],
    {
      renderer: 'verbose'
    }
  )

  await releaseChecks(opts)
  return tasks.run(opts)
}

module.exports = release
