/* eslint-disable no-console */
'use strict'

const { lilconfigSync } = require('lilconfig')
const merge = require('merge-options')

/**
 * @typedef {import("./../types").Options} Options
 */

/**
 *
 * @param {*} hooks
 */
function normalizeHooks (hooks = {}) {
  const result = {
    browser: {
      pre: () => Promise.resolve(),
      post: () => Promise.resolve()
    },
    node: {
      pre: () => Promise.resolve(),
      post: () => Promise.resolve()
    }
  }

  if (hooks.pre && hooks.post) {
    result.browser.pre = hooks.pre
    result.browser.post = hooks.post
    result.node.pre = hooks.pre
    result.node.post = hooks.post

    return result
  }

  return merge(result, hooks)
}

/**
 * Search for local user config
 *
 * @param {string | undefined} [searchFrom]
 * @returns {Options}
 */
const config = (searchFrom) => {
  let userConfig
  try {
    const configExplorer = lilconfigSync('aegir', {

      searchPlaces: [
        'package.json',
        '.aegir.js'
      ]
    })
    const lilconfig = configExplorer.search(searchFrom)
    if (lilconfig) {
      userConfig = lilconfig.config
    } else {
      userConfig = {}
    }
  } catch (err) {
    console.error(err)
    throw new Error('Error finding your config file.')
  }

  /** @type {Options} */
  const conf = merge(
    {
      // global options
      debug: false,
      node: false,
      tsRepo: false,
      hooks: {},
      // test cmd options
      test: {
        runner: 'node',
        target: ['node', 'browser', 'webworker'],
        watch: false,
        files: [],
        timeout: 5000,
        grep: '',
        bail: false,
        progress: false,
        cov: false,
        browser: {
          config: {}
        }
      },
      // build cmd options
      build: {
        bundle: true,
        bundlesize: false,
        bundlesizeMax: '100kB',
        types: true,
        config: {}
      },
      // linter cmd options
      lint: {
        silent: false,
        fix: false,
        files: [
          '*.{js,ts}',
          'bin/**',
          'config/**/*.{js,ts}',
          'test/**/*.{js,ts}',
          'src/**/*.{js,ts}',
          'tasks/**/*.{js,ts}',
          'benchmarks/**/*.{js,ts}',
          'utils/**/*.{js,ts}',
          '!**/node_modules/**',
          '!**/*.d.ts'
        ]
      },
      // docs cmd options
      docs: {
        publish: false,
        entryPoint: 'src/index.js'
      },
      ts: {
        preset: undefined,
        include: [],
        copyFrom: 'src/**/*.d.ts',
        copyTo: 'dist'
      }
    },
    userConfig,
    {
      hooks: normalizeHooks(userConfig.hooks)
    }
  )

  return conf
}

module.exports = {
  userConfig: config(),
  config
}
