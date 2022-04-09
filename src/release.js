/* eslint-disable no-console */

import Listr from 'listr'
import { execa } from 'execa'
import { isMonorepoProject } from './utils.js'

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").BuildOptions} BuildOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 */

const tasks = new Listr([
  {
    title: 'clean',
    task: async () => {
      await execa('npm', ['run', 'clean', '--if-present'], {
        stdio: 'inherit'
      })
    }
  },
  {
    title: 'build',
    /**
     * @param {GlobalOptions & BuildOptions} ctx
     */
    task: async (ctx) => {
      await execa('npm', ['run', 'build', '--if-present'], {
        stdio: 'inherit'
      })
    }
  },
  {
    title: `semantic-release${isMonorepoProject ? '-monorepo' : ''}`,
    /**
     * @param {GlobalOptions} ctx
     */
    task: async (ctx) => {
      let args = ctx['--'] ?? []

      if (isMonorepoProject) {
        args = ['-e', 'semantic-release-monorepo', ...args]
      }

      await execa('semantic-release', args, {
        preferLocal: true,
        stdio: 'inherit'
      })
    }
  }
], { renderer: 'verbose' })

export default tasks
