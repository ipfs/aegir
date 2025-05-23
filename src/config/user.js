/* eslint-disable no-console */

import { pathToFileURL } from 'url'
import { lilconfig } from 'lilconfig'
import merge from '../utils/merge-options.js'
import { isTypescript } from '../utils.js'

/**
 * @typedef {import('../types.js').Options} Options
 */

/** @type {Omit<Options, "fileConfig">} */
const defaults = {
  // global options
  debug: false,
  // test cmd options
  test: {
    build: true,
    runner: 'node',
    target: ['node', 'browser', 'webworker'],
    watch: false,
    files: [],
    timeout: 60000,
    grep: '',
    bail: false,
    progress: false,
    cov: false,
    covTimeout: 60000,
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
    config: {}
  },
  // linter cmd options
  lint: {
    silent: false,
    fix: false,
    files: [
      '*.{js,ts,jsx,tsx}',
      'bin/**',
      'config/**/*.{js,ts,jsx,tsx}',
      'test/**/*.{js,ts,jsx,tsx}',
      'src/**/*.{js,ts,jsx,tsx}',
      'tasks/**/*.{js,ts,jsx,tsx}',
      'benchmarks/**/*.{js,ts,jsx,tsx}',
      '!benchmarks/**/node_modules/**',
      'utils/**/*.{js,ts,jsx,tsx}',
      '!**/node_modules/**',
      'examples/**/*.{js,ts,jsx,tsx}',
      '!examples/**/node_modules/**'
    ]
  },
  // docs cmd options
  docs: {
    publish: Boolean(process.env.CI),
    entryPoint: isTypescript ? 'src/index.ts' : 'src/index.js',
    message: 'docs: update documentation [skip ci]',
    user: 'aegir[bot]',
    email: 'aegir[bot]@users.noreply.github.com',
    directory: '.docs'
  },
  // document check cmd options
  documentCheck: {
    inputFiles: [
      '*.md',
      'src/*.md'
    ],
    tsConfigPath: '.'
  },
  // ts cmd options
  ts: {
    preset: undefined,
    include: []
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
    remote: 'origin',
    siblingDepUpdateMessage: 'chore: update sibling dependencies',
    siblingDepUpdateName: 'aegir[bot]',
    siblingDepUpdateEmail: 'aegir[bot]@users.noreply.github.com'
  },
  releaseRc: {
    retries: 5,
    tag: 'next',
    prefix: true
  },
  // dependency check cmd options
  dependencyCheck: {
    unused: false,
    ignore: [],
    productionIgnorePatterns: [
      '/benchmark',
      '/benchmarks',
      '/dist',
      '/test',
      '.aegir.js'
    ],
    developmentIgnorePatterns: [
      '/dist',
      '/src'
    ]
  },
  exec: {
    bail: true,
    prefix: true
  },
  run: {
    bail: true,
    prefix: true
  }
}

/**
 * Search for local user config
 *
 * @param {string | undefined} [searchFrom]
 * @returns {Promise<Options>}
 */
export const config = async (searchFrom) => {
  let userConfig
  try {
    const loadEsm = async (/** @type {string} */ filepath) => {
      /** @type {any} */
      const res = await import(pathToFileURL(filepath).toString())

      if (res.default != null) {
        return res.default
      }

      if (typeof res.toString === 'function') {
        return res
      }

      // if there's no toString function, this was an ES module that didn't export anything
      return {}
    }
    const loadedConfig = await lilconfig('aegir', {
      loaders: {
        '.js': loadEsm,
        '.mjs': loadEsm
      },
      searchPlaces: [
        'package.json',
        '.aegir.js',
        '.aegir.cjs'
      ]
    })
      .search(searchFrom)

    if (loadedConfig) {
      userConfig = loadedConfig.config
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

export const loadUserConfig = () => config()
