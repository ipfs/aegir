import { execa } from 'execa'
import pMap from 'p-map'
import browser from './browser.js'
import deno from './deno.js'
import electron from './electron.js'
import node from './node.js'
import rn from './react-native.js'

/**
 * These environments can run `.ts` files natively so do not need a build step
 */
const NO_BUILD = [
  'node',
  'deno',
  'electron-main',
  'electron-renderer'
]

/**
 * @param {TestOptions & GlobalOptions} ctx
 */
function shouldBuild (ctx) {
  if (ctx.build === false) {
    return false
  }

  if (ctx.target.every(target => NO_BUILD.includes(target))) {
    return false
  }

  return ctx.build
}

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('../types.js').TestOptions} TestOptions
 * @typedef {import('../types.js').GlobalOptions} GlobalOptions
 * @typedef {import('../types.js').BuildOptions} BuildOptions
 */

const TASKS = [
  {
    title: 'build',

    /**
     * @param {TestOptions & GlobalOptions} ctx
     */
    enabled: (ctx) => shouldBuild(ctx),

    /**
     * @param {BuildOptions & GlobalOptions} ctx
     */
    task: async (ctx) => {
      await execa('npm', ['run', 'build', '--if-present'], {
        stdio: 'inherit'
      })
    }
  },
  {
    title: 'test node.js',
    /**
     * @param {TestOptions & GlobalOptions} opts
     * @param {ExecaOptions} execaOptions
     */
    task: (opts, execaOptions) => node({ ...opts, runner: 'node' }, execaOptions),
    /**
     * @param {TestOptions & GlobalOptions} ctx
     */
    enabled: (ctx) => ctx.target.includes('node')
  },
  {
    title: 'test deno',
    /**
     * @param {TestOptions & GlobalOptions} opts
     * @param {ExecaOptions} execaOptions
     */
    task: (opts, execaOptions) => deno({ ...opts, runner: 'deno' }, execaOptions),
    /**
     * @param {TestOptions & GlobalOptions} ctx
     */
    enabled: (ctx) => ctx.target.includes('deno')
  },
  {
    title: 'test browser',
    /**
     * @param {TestOptions & GlobalOptions} opts
     * @param {ExecaOptions} execaOptions
     */
    task: (opts, execaOptions) => browser({ ...opts, runner: 'browser' }, execaOptions),
    /**
     * @param {TestOptions & GlobalOptions} ctx
     */
    enabled: (ctx) => ctx.target.includes('browser')
  },
  {
    title: 'test webworker',
    /**
     * @param {TestOptions & GlobalOptions} opts
     * @param {ExecaOptions} execaOptions
     */
    task: (opts, execaOptions) => browser({ ...opts, runner: 'webworker' }, execaOptions),
    /**
     * @param {TestOptions & GlobalOptions} ctx
     */
    enabled: (ctx) => ctx.target.includes('webworker')
  },
  {
    title: 'test electron main',
    /**
     * @param {TestOptions & GlobalOptions} opts
     * @param {ExecaOptions} execaOptions
     */
    task: (opts, execaOptions) => electron({ ...opts, runner: 'electron-main' }, execaOptions),
    /**
     * @param {TestOptions & GlobalOptions} ctx
     */
    enabled: (ctx) => ctx.target.includes('electron-main')
  },
  {
    title: 'test electron renderer',
    /**
     * @param {TestOptions & GlobalOptions} opts
     * @param {ExecaOptions} execaOptions
     */
    task: (opts, execaOptions) => electron({ ...opts, runner: 'electron-renderer' }, execaOptions),
    /**
     * @param {TestOptions & GlobalOptions} ctx
     */
    enabled: (ctx) => ctx.target.includes('electron-renderer')
  },
  {
    title: 'test react native android',
    /**
     * @param {TestOptions & GlobalOptions} opts
     * @param {ExecaOptions} execaOptions
     */
    task: (opts, execaOptions) => rn({ ...opts, runner: 'react-native-android' }, execaOptions),
    /**
     * @param {TestOptions & GlobalOptions} ctx
     */
    enabled: (ctx) => ctx.target.includes('react-native-android')
  }
]

export default {
  /**
   *
   * @param {TestOptions & BuildOptions & GlobalOptions} opts
   * @param {ExecaOptions} execaOptions
   */
  run (opts, execaOptions = {}) {
    return pMap(TASKS, (task) => {
      if (!task.enabled(opts)) {
        return Promise.resolve()
      }
      if (execaOptions.stdio !== 'ignore') {
        console.log(task.title) // eslint-disable-line no-console
      }
      return task.task(opts, execaOptions)
    }, { concurrency: 1 })
  }
}
