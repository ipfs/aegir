/* eslint-disable no-console */
'use strict'

const Listr = require('listr')
const execa = require('execa')
const cleanCmd = require('./clean')
const buildCmd = require('./build')

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").BuildOptions} BuildOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 */

const tasks = new Listr([
  {
    title: 'clean',
    /**
     * @param {GlobalOptions} ctx
     */
    task: async (ctx) => {
      await cleanCmd.run(ctx)
    }
  },
  {
    title: 'build',
    /**
     * @param {GlobalOptions & BuildOptions} ctx
     */
    task: async (ctx) => {
      await buildCmd.run(ctx)
    }
  },
  {
    title: 'semantic-release',
    /**
     * @param {GlobalOptions} ctx
     */
    task: async (ctx) => {
      await execa('semantic-release', ctx['--'] ?? [], {
        preferLocal: true,
        stdio: 'inherit'
      })
    }
  }
], { renderer: 'verbose' })

module.exports = tasks
