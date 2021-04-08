'use strict'

const pmap = require('p-map')
const node = require('./node')
const browser = require('./browser')
const electron = require('./electron')
const rn = require('./react-native')

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('./../types').TestOptions} TestOptions
 * @typedef {import('./../types').GlobalOptions} GlobalOptions
 */

const TASKS = [
  {
    title: 'Test Node.js',
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
    title: 'Test Browser',
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
    title: 'Test Webworker',
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
    title: 'Test Electron Main',
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
    title: 'Test Electron Renderer',
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
    title: 'Test React Native Android',
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

module.exports = {
  /**
   *
   * @param {TestOptions & GlobalOptions} opts
   * @param {ExecaOptions} execaOptions
   */
  run (opts, execaOptions = {}) {
    return pmap(TASKS, (task) => {
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
