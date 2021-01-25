/* eslint-disable no-console */
'use strict'

const { lilconfigSync } = require('lilconfig')
const merge = require('merge-options')
const utils = require('../utils')

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

const config = () => {
  let userConfig
  try {
    const configExplorer = lilconfigSync('aegir', {
      searchPlaces: [
        'package.json',
        '.aegir.js'
      ]
    })
    const lilconfig = configExplorer.search()
    if (lilconfig) {
      userConfig = lilconfig.config
    } else {
      userConfig = {}
    }
  } catch (err) {
    console.error(err)
    throw new Error('Error finding your config file.')
  }
  const conf = merge(
    {
      // global options
      debug: false,
      node: false,
      ts: false,
      // old options
      webpack: {},
      karma: {},
      hooks: {},
      entry: utils.fromRoot('src', 'index.js'),
      bundlesize: {
        path: './dist/index.min.js',
        maxSize: '100kB'
      },
      // build cmd options
      build: {
        bundle: true,
        bundlesize: false,
        types: true
      },
      // linter cmd options
      lint: {
        fix: false
      },
      // docs cmd options
      docs: {
        publish: false,
        entryPoint: 'src/index.js'
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
  userConfig: config()
}
