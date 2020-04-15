/**
 * Various utility methods used in AEgir.
 *
 * @module aegir/utils
 */
'use strict'

const os = require('os')
const ora = require('ora')
const extract = require('extract-zip')
const { download } = require('@electron/get')
const path = require('path')
const findUp = require('findup-sync')
const readPkgUp = require('read-pkg-up')
const fs = require('fs-extra')
const execa = require('execa')
const pascalcase = require('pascalcase')

const { packageJson: pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
})
const PKG_FILE = 'package.json'
const DIST_FOLDER = 'dist'
const SRC_FOLDER = 'src'

exports.paths = {
  dist: DIST_FOLDER,
  src: SRC_FOLDER
}
exports.pkg = pkg
// TODO: get this from aegir package.json
exports.browserslist = '>1% or node >=10 and not ie 11 and not dead'

exports.repoDirectory = path.dirname(pkgPath)
exports.fromRoot = (...p) => path.join(exports.repoDirectory, ...p)
exports.hasFile = (...p) => fs.existsSync(exports.fromRoot(...p))
exports.fromAegir = (...p) => path.join(__dirname, '..', ...p)
/**
 * Gets the top level path of the project aegir is executed in.
 *
 * @returns {string}
 */
exports.getBasePath = () => {
  return process.cwd()
}

/**
 * @returns {string}
 */
exports.getPathToPkg = () => {
  return path.join(exports.getBasePath(), PKG_FILE)
}

/**
 * @returns {Promise<Object>}
 */
exports.getPkg = () => {
  return fs.readJson(exports.getPathToPkg())
}

/**
 * @returns {string}
 */
exports.getPathToDist = () => {
  return path.join(exports.getBasePath(), DIST_FOLDER)
}

/**
 * @returns {string}
 */
exports.getUserConfigPath = () => {
  return findUp('.aegir.js')
}

/**
 * @returns {Object}
 */
exports.getUserConfig = () => {
  let conf = {}
  try {
    const path = exports.getUserConfigPath()
    if (!path) {
      return {}
    }
    conf = require(path)
  } catch (err) {
    console.error(err) // eslint-disable-line no-console
  }
  return conf
}

/**
 * Converts the given name from something like `peer-id` to `PeerId`.
 *
 * @param {string} name
 *
 * @returns {string}
 */
exports.getLibraryName = (name) => {
  return pascalcase(name)
}

/**
 * Get the absolute path to `node_modules` for aegir itself
 *
 * @returns {string}
 */
exports.getPathToNodeModules = () => {
  return path.resolve(__dirname, '../node_modules')
}

/**
 * Get the config for Listr.
 *
 * @returns {Object}
 */
exports.getListrConfig = () => {
  return {
    renderer: 'verbose'
  }
}

/**
 * Path to example file.
 *
 * @returns {string}
 */
exports.getPathToExample = () => {
  return path.join(exports.getBasePath(), 'example.js')
}

/**
 * Path to documentation config file.
 *
 * @returns {string}
 */
exports.getPathToDocsConfig = () => {
  return path.join(exports.getBasePath(), 'documentation.yml')
}

/**
 * Path to documentation folder.
 *
 * @returns {string}
 */
exports.getPathToDocs = () => {
  return path.join(exports.getBasePath(), 'docs')
}

/**
 * Path to documentation index.html.
 *
 * @returns {string}
 */
exports.getPathToDocsFile = () => {
  return path.join(exports.getPathToDocs(), 'index.html')
}

/**
 * Path to documentation index.md.
 *
 * @returns {string}
 */
exports.getPathToDocsMdFile = () => {
  return path.join(exports.getPathToDocs(), 'index.md')
}

exports.hook = (env, key) => (ctx) => {
  if (ctx && ctx.hooks) {
    if (ctx.hooks[env] && ctx.hooks[env][key]) {
      return ctx.hooks[env][key]()
    }
    if (ctx.hooks[key]) {
      return ctx.hooks[key]()
    }
  }

  return Promise.resolve()
}

exports.exec = (command, args, options = {}) => {
  const result = execa(command, args, options)

  if (!options.quiet) {
    result.stdout.pipe(process.stdout)
  }

  result.stderr.pipe(process.stderr)

  return result
}

function getPlatformPath () {
  const platform = process.env.npm_config_platform || os.platform()

  switch (platform) {
    case 'mas':
    case 'darwin':
      return 'Electron.app/Contents/MacOS/Electron'
    case 'freebsd':
    case 'openbsd':
    case 'linux':
      return 'electron'
    case 'win32':
      return 'electron.exe'
    default:
      throw new Error('Electron builds are not available on platform: ' + platform)
  }
}

exports.getElectron = async () => {
  const pkg = require('./../package.json')
  const version = pkg.devDependencies.electron.slice(1)
  const spinner = ora(`Downloading electron: ${version}`).start()
  const zipPath = await download(version)
  const electronPath = path.join(path.dirname(zipPath), getPlatformPath())
  if (!fs.existsSync(electronPath)) {
    spinner.text = 'Extracting electron to system cache'
    await extract(zipPath, { dir: path.dirname(zipPath) })
  }
  spinner.succeed('Electron ready to use')
  return electronPath
}
