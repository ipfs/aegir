/* eslint-disable no-console */
'use strict'

const { lilconfigSync } = require('lilconfig')
const merge = require('merge-options')

/**
 * @typedef {import("./../types").Options} Options
 */

/** @type {Omit<Options, "fileConfig">} */
const defaults = {
  // global options
  debug: false,
  tsRepo: false,
  // test cmd options
  test: {
    runner: 'node',
    target: ['node', 'browser', 'webworker'],
    watch: false,
    files: [],
    timeout: 60000,
    grep: '',
    bail: false,
    progress: false,
    cov: false,
    browser: {
      config: {
        buildConfig: {
          conditions: ['production']
        }
      }
    },
    before: async () => { return undefined },
    after: async () => {}
  },
  // build cmd options
  build: {
    bundle: true,
    bundlesize: false,
    bundlesizeMax: '100kB',
    types: true,
    config: {},
    esmMain: true,
    esmTests: false
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
      '!**/node_modules/**'
    ]
  },
  // docs cmd options
  docs: {
    publish: false,
    entryPoint: 'src/index.js'
  },
  // ts cmd options
  ts: {
    preset: undefined,
    include: [],
    copyFrom: 'src/**/*.d.ts',
    copyTo: 'dist'
  },
  // release cmd options
  release: {
    build: true,
    types: true,
    test: true,
    lint: true,
    contributors: true,
    bump: true,
    changelog: true,
    publish: true,
    commit: true,
    tag: true,
    push: true,
    ghrelease: true,
    docs: true,
    ghtoken: '',
    type: 'patch',
    preid: undefined,
    distTag: 'latest',
    remote: 'origin'
  },
  // dependency check cmd options
  dependencyCheck: {
    input: [
      'package.json',
      '.aegir.js',
      '.aegir.cjs',
      'src/**/*.js',
      'src/**/*.cjs',
      'test/**/*.js',
      'test/**/*.cjs',
      'benchmarks/**/*.js',
      'benchmarks/**/*.cjs',
      'utils/**/*.js',
      'utils/**/*.cjs',
      '!./test/fixtures/**/*.js',
      '!./test/fixtures/**/*.cjs'
    ],
    productionOnly: false,
    productionInput: [
      'package.json',
      'src/**/*.js',
      'src/**/*.cjs'
    ],
    ignore: [
      '@types/*'
    ]
  }
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
        '.aegir.js',
        '.aegir.cjs'
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

  const conf = /** @type {Options} */(merge(
    defaults,
    userConfig
  ))

  return conf
}

module.exports = {
  userConfig: config(),
  config
}
