
/**
 * Options for CLI and local file config
 *
 *
 */
interface Options extends GlobalOptions {
  /**
   * Options for the `build` command
   */
  build: BuildOptions
  /**
   * Options for the `ts` command
   */
  ts: TSOptions
  /**
   * Options for the `docs` command
   */
  docs: DocsOptions
  /**
   * Options for the `lint` command
   */
  lint: LintOptions
  /**
   * Options for the `test` command
   */
  test: TestOptions

}

interface GlobalOptions {
  /**
   * Show debug output.
   */
  debug: boolean
  /**
   * Enable support for Typescript repos.
   */
  tsRepo: boolean

  /**
   * Forward options to pass to the backend command populated by yargs parser
   */
  '--'?: string[]
  /**
   * CLI Input
   */
  '_'?: string
  /**
   * Hooks
   */
  hooks: any
  /**
   * Full config from configuration file
   */
  config: Options
}

interface BuildOptions {
  /**
   * Build the JS standalone bundle.
   */
  bundle: boolean
  /**
   * Analyse bundle size. Default threshold is 100kB, you can override that in `.aegir.js` with the property `bundlesize.maxSize`.
   */
  bundlesize: boolean
  /**
   * Max threshold for the bundle size.
   */
  bundlesizeMax: string
  /**
   * Build the Typescripts type declarations.
   */
  types: boolean
}

interface TSOptions {
  /**
   * Preset to run.
   */
  preset: 'config' | 'check' | 'types'
  /**
   * Values are merged into the local TS config include property.
   */
  include: string[]
  /**
   * Copy .d.ts files from
   */
  copyFrom: string
  /**
   * Copy .d.ts files to
   */
  copyTo: string
}

interface DocsOptions {
  /**
   * Publish to GitHub Pages
   */
  publish: boolean
  /**
   * Specifies the entry points to be documented by TypeDoc. TypeDoc will examine the exports of these files and create documentation according to the exports. Either files or directories may be specified. If a directory is specified, all source files within the directory will be included as an entry point.
   */
  entryPoint: string
}

interface LintOptions {
  /**
   * Automatically fix errors if possible.
   */
  fix: boolean
  /**
   * Files to lint.
   */
  files: string[]
  /**
   * Disable eslint output.
   */
  silent: boolean
}

interface TestOptions {
  /**
   * In which target environment to execute the tests
   */
  target: Array<'node' | 'browser' | 'webworker' | 'electron-main' | 'electron-renderer'>
  /**
   * Watch files for changes and rerun tests
   */
  watch: boolean
  /**
   * Custom globs for files to test
   */
  files: string[]
  /**
   * The default time a single test has to run
   */
  timeout: number
  /**
   * Limit tests to those whose names match given pattern
   */
  grep: string
  /**
   * Bail once a test fails
   */
  bail: boolean
  /**
   * Use progress reporters
   */
  progress: boolean
  /**
   * Enable coverage output
   */
  cov: boolean
  /**
   * Runner enviroment
   */
  runner: 'node' | 'browser' | 'webworker' | 'electron-main' | 'electron-renderer'
  /**
   * Browser options
   */
  browser: {
    /**
     * playwright-test config
     */
    config: any
  }
}

export type {
  Options,
  GlobalOptions,
  BuildOptions,
  TSOptions,
  DocsOptions,
  LintOptions,
  TestOptions
}
