/* eslint-disable no-console */
'use strict'

const { lilconfigSync } = require('lilconfig')
const merge = require('merge-options')
const utils = require('../utils')

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
      // old options
      webpack: {},
      karma: {},
      hooks: {},
      entry: utils.fromRoot('src', 'index.js'),
      // build cmd options
      build: {
        bundle: true,
        bundlesize: false,
        bundlesizeMax: '100kB',
        types: true
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
        include: []
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
