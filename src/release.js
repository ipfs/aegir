/* eslint-disable no-console */

import Listr from 'listr'
import { execa } from 'execa'
import cleanCmd from './clean.js'
import buildCmd from './build/index.js'

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

export default tasks
