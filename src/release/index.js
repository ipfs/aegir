'use strict'

const Listr = require('listr')

const lint = require('../lint')
const test = require('../test')
const ts = require('../ts')
const build = require('../build')
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
const { hasTsconfig } = require('./../utils')

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
  const globalOptions = {
    debug: opts.debug,
    tsRepo: opts.tsRepo,
    fileConfig: opts.fileConfig
  }

  const tasks = new Listr(
    [
      {
        title: 'Lint',
        task: () => {
          lint.setRenderer('silent')
          return lint.run({
            ...globalOptions,
            ...opts.fileConfig.lint
          })
        },
        enabled: () => opts.lint
      },
      {
        title: 'Types',
        task: () => {
          return ts({
            ...globalOptions,
            ...opts.fileConfig.ts,
            preset: 'check'
          })
        },
        enabled: () => opts.types && hasTsconfig
      },
      {
        title: 'Test',
        task: () =>
          test.run(
            {
              ...globalOptions,
              ...opts.fileConfig.test
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
        title: 'Documentation',
        task: () => {
          docs.setRenderer('silent')
          return docs.run({
            ...globalOptions,
            ...opts.fileConfig.docs,
            publish: true
          })
        },
        enabled: () => opts.docs
      },
      {
        title: 'Build',
        enabled: (ctx) => ctx.build,
        task: () => {
          build.setRenderer('silent')
          return build.run({
            ...globalOptions,
            ...opts.fileConfig.build
          })
        }
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
