/**
 * Various utility methods used in AEgir.
 *
 * @module aegir/utils
 */
'use strict'

const path = require('path')
const findUp = require('findup-sync')
const readPkgUp = require('read-pkg-up')
const fs = require('fs-extra')
const arrify = require('arrify')
const _ = require('lodash')
const VerboseRenderer = require('listr-verbose-renderer')

const { pkg, path: pkgPath } = readPkgUp.sync({
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
exports.hasPkgProp = props => arrify(props).some(prop => _.has(pkg, prop))
// TODO: get this from aegir package.json
exports.browserslist = [
  '>1%',
  'last 2 versions',
  'Firefox ESR',
  'not ie < 11'
]

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
    if (!path) return null
    conf = require(path)
  } catch (err) {
    console.error(err)
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
  return _.upperFirst(_.camelCase(name))
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
    renderer: VerboseRenderer
  }
}

/**
 * Get current env variables for inclusion.
 *
 * @param {string} [env='development']
 *
 * @returns {Object}
 */
exports.getEnv = (env) => {
  const PREFIX = /^AEGIR_/i
  let NODE_ENV = env || 'development'
  if (JSON.stringify(process.env.NODE_ENV) !== JSON.stringify(undefined) && process.env.NODE_ENV) {
    NODE_ENV = process.env.NODE_ENV
  }

  const raw = Object.keys(process.env)
    .filter((key) => PREFIX.test(key))
    .reduce((env, key) => {
      if (key === 'AEGIR_GHTOKEN') {
        return env
      } else {
        env[key] = process.env[key]
        return env
      }
    }, {
      NODE_ENV: NODE_ENV
    })

  const stringifed = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {})
  }

  return {
    raw: raw,
    stringified: stringifed
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
