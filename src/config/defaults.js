/**
 * @typedef {import("./../types").Options} Options
 */

/** @type {Omit<Options, "fileConfig">} */
const defaults = {
  // global options
  debug: false,
  // test cmd options
  test: {
    build: false,
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
      'dist/**/*.js',
      'benchmarks/**/*.js',
      'benchmarks/**/*.cjs',
      'utils/**/*.js',
      'utils/**/*.cjs',
      '!./test/fixtures/**/*.js',
      '!./test/fixtures/**/*.cjs',
      '!./dist/test/fixtures/**/*.js',
      '!./dist/test/fixtures/**/*.cjs',
      '!**/*.min.js'
    ],
    productionOnly: false,
    productionInput: [
      'package.json',
      'src/**/*.js',
      'src/**/*.cjs',
      'dist/src/**/*.js',
      'utils/**/*.js',
      'utils/**/*.cjs'
    ],
    ignore: [
      '@types/*'
    ]
  }
}

export { defaults }
