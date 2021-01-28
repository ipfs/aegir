
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
}

interface GlobalOptions {
  /**
   * Show debug output.
   */
  debug: boolean
  /**
   * Flag to control if bundler should inject node globals or built-ins.
   */
  node: boolean
  /**
   * Enable support for Typescript repos.
   */
  tsRepo: boolean

  /**
   * Foward options to pass to the backend command populated by yargs parser
   */
  '--'?: string[]

  /**
   * CLI Input
   */
  '_'?: string
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

export type {
  Options,
  GlobalOptions,
  BuildOptions,
  TSOptions,
  DocsOptions,
  LintOptions
}
