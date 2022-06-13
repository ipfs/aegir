import type esbuild from 'esbuild'

/**
 * Options for CLI and local file config
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
  /**
   * Options for the `release` command
   */
  release: ReleaseOptions
  /**
   * Options for the `dependency-check` command
   */
  dependencyCheck: DependencyCheckOptions
}

/**
 * Partial options for local file config
 */
interface PartialOptions {
  /**
   * Show debug output.
   */
  debug?: boolean
  /**
   * Options for the `build` command
   */
  build?: Partial<BuildOptions>
  /**
   * Options for the `ts` command
   */
  ts?: Partial<TSOptions>
  /**
   * Options for the `docs` command
   */
  docs?: Partial<DocsOptions>
  /**
   * Options for the `lint` command
   */
  lint?: Partial<LintOptions>
  /**
   * Options for the `test` command
   */
  test?: Partial<TestOptions>
  /**
   * Options for the `release` command
   */
  release?: Partial<ReleaseOptions>
  /**
   * Options for the `dependency-check` command
   */
  dependencyCheck?: DependencyCheckOptions
}

interface GlobalOptions {
  /**
   * Show debug output.
   */
  debug: boolean
  /**
   * Forward options to pass to the backend command populated by yargs parser
   */
  '--'?: string[]
  /**
   * CLI Input
   */
  '_'?: string
  /**
   * Full config from configuration file
   */
  fileConfig: Options
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
   * Build the Typescript type declarations.
   */
  types: boolean
  /**
   * esbuild build options
   */
  config: esbuild.BuildOptions
}

interface TSOptions {
  /**
   * Preset to run.
   */
  preset: 'config' | 'check' | 'types' | undefined
  /**
   * Values are merged into the local TS config include property.
   */
  include: string[]
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
   * Build the project before running the tests
   */
  build: boolean
  /**
   * In which target environment to execute the tests
   */
  target: Array<'node' | 'browser' | 'webworker' | 'electron-main' | 'electron-renderer' | 'react-native-android' | 'react-native-ios'>
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
  runner: 'node' | 'browser' | 'webworker' | 'electron-main' | 'electron-renderer' | 'react-native-android' | 'react-native-ios'
  /**
   * Browser options
   */
  browser: {
    /**
     * playwright-test config @see https://github.com/hugomrdias/playwright-test
     */
    config: any
  }
  /**
   * Before tests hook
   */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  before: (options: GlobalOptions & TestOptions) => Promise<TestBeforeResult | void >
  /**
   * After tests hook
   */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  after: (options: GlobalOptions & TestOptions, beforeResult: TestBeforeResult | void) => Promise<void>
}

interface TestBeforeResult {
  env?: NodeJS.ProcessEnv
}

interface ReleaseOptions {
  build: boolean
  types: boolean
  test: boolean
  lint: boolean
  contributors: boolean
  bump: boolean
  changelog: boolean
  publish: boolean
  commit: boolean
  tag: boolean
  push: boolean
  /**
   * Generate GitHub release
   */
  ghrelease: boolean
  /**
   * Generate and publish documentation
   */
  docs: boolean
  /**
   * Access token for generating GitHub releases
   */
  ghtoken: string
  /**
   * The type of version bump for this release
   */
  type: 'major' | 'minor' | 'patch' | 'prepatch' | 'preminor' | 'premajor' | 'prerelease'
  /**
   * Identifier to be used to prefix premajor, preminor, prepatch or prerelease version increments.
   */
  preid?: string
  /**
   * The npm tag to publish to
   */
  distTag: string
  /**
   * Git remote
   */
  remote: string
}

interface DependencyCheckOptions {
  /**
   * Files to check
   */
  input: string[]
  /**
   * Check production dependencies and paths only
   */
  productionOnly: boolean
  /**
   * Ignore these dependencies when considering which are used and which are not
   */
  ignore: string[]
  /**
   * Files to check when in production only mode
   */
  productionInput: string[]
}

export type {
  PartialOptions,
  Options,
  GlobalOptions,
  BuildOptions,
  TSOptions,
  DocsOptions,
  LintOptions,
  TestOptions,
  ReleaseOptions,
  DependencyCheckOptions
}
