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
   * Options for the `release-rc` command
   */
  releaseRc: ReleaseRcOptions
  /**
   * Options for the `dependency-check` command
   */
  dependencyCheck: DependencyCheckOptions
  /**
   * Options for the `document-check` command
   */
  documentCheck: DocsVerifierOptions
  /**
   * Options for the `exec` command
   */
  exec: ExecOptions
  /**
   * Options for the `run` command
   */
  run: RunOptions
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
  /**
   * Options for the `document-check` command
   */
  documentCheck?: DocsVerifierOptions
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
  _?: string
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
   * Analyze bundle size. Default threshold is 100kB, you can override that in `.aegir.js` with the property `bundlesize.maxSize`.
   */
  bundlesize: boolean
  /**
   * Max threshold for the bundle size(s).  Either a single string for when only
   * `dist/index.min.js` is built or an object of key/value pairs, e.g.
   *
   * ```json
   * {
   *   "bundlesizeMax": {
   *     "dist/index.min.js": "50KB",
   *     "dist/worker.min.js": "80KB"
   *   }
   * }
   * ```
   */
  bundlesizeMax: string | Record<string, string>
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
  /**
   * The commit message to use in the gh-pages branch
   */
  message: string
  /**
   * The user to make the commit with
   */
  user: string
  /**
   * The email address to make the commit with
   */
  email: string
  /**
   * Where to build the documentation
   */
  directory: string
  /**
   * If set a CNAME file will be written with a custom domain
   */
  cname?: string
}

interface DocsVerifierOptions {
  /**
   * The Markdown files to be verified, defaults to `README.md`
   */
  inputFiles?: string[]

  /**
   * An alternative `.tsconfig.json` path to be used separately from the default
   */
  tsConfigPath?: string
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
   * How long to wait for collecting code coverage. Workaround for @see https://github.com/ipfs/aegir/issues/1206
   */
  covTimeout: number
  /**
   * Runner environment
   */
  runner: 'node' | 'browser' | 'webworker' | 'electron-main' | 'electron-renderer' | 'react-native-android' | 'react-native-ios'
  /**
   * Browser options
   */
  browser: {
    /**
     * playwright-test config @see https://github.com/hugomrdias/playwright-test
     */
    config: unknown
  }
  /**
   * Before tests hook
   */

  before(options: GlobalOptions & TestOptions): Promise<TestBeforeResult | void >
  /**
   * After tests hook
   */

  after(options: GlobalOptions & TestOptions, beforeResult: TestBeforeResult | void): Promise<void>
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
  /**
   * During a monorepo release, if a package release means the dependencies of
   * it's siblings change, use this as the commit message
   */
  siblingDepUpdateMessage: string

  /**
   * The name to use in a git commit that update sibling deps
   */
  siblingDepUpdateName: string

  /**
   * The email to use in a git commit that update sibling deps
   */
  siblingDepUpdateEmail: string
}

interface ReleaseRcOptions {
  /**
   * How many times to retry each publish operation
   */
  retries: number

  /**
   * Which tag to publish the rc as
   */
  tag: string

  /**
   * Prefix output with the package name
   */
  prefix?: boolean

  /**
   * Release modules in parallel up to this limit
   */
  concurrency?: number
}

interface DependencyCheckOptions {
  /**
   * throws error on unused dependencies
   *
   * @default true
   */
  unused: boolean

  /**
   * Ignore these dependencies when considering which are used and which are not
   */
  ignore: string[]

  /**
   * Files to ignore when checking production dependencies
   */
  productionIgnorePatterns: string[]

  /**
   * Files to ignore when checking dev dependencies
   */
  developmentIgnorePatterns: string[]
}

interface ExecOptions {
  /**
   * If false, the command will continue to be run in other packages
   */
  bail?: boolean

  /**
   * Prefix output with the package name
   */
  prefix?: boolean

  /**
   * Run commands in parallel up to this limit
   */
  concurrency?: number
}

interface RunOptions {
  /**
   * If false, the script will continue to be run in other packages
   */
  bail?: boolean

  /**
   * Prefix output with the package name
   */
  prefix?: boolean

  /**
   * Run scripts in parallel up to this limit
   */
  concurrency?: number
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
  DocsVerifierOptions,
  ReleaseRcOptions,
  DependencyCheckOptions,
  ExecOptions,
  RunOptions
}
