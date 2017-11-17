/**
 * Various utility methods used in AEgir.
 *
 * @module aegir/utils
 */
'use strict'

const path = require('path')
const findUp = require('findup-sync')
const fs = require('fs-extra')
const _ = require('lodash')
const VerboseRenderer = require('listr-verbose-renderer')
const UpdateRenderer = require('listr-update-renderer')

const PKG_FILE = 'package.json'
const DIST_FOLDER = 'dist'

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
    conf = require(exports.getUserConfigPath())
  } catch (err) {
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
 * Get the config for Listr depending on the current environment.
 *
 * @returns {Object}
 */
exports.getListrConfig = () => {
  const isCI = String(process.env.CI) !== 'undefined'
  return {
    renderer: isCI ? VerboseRenderer : UpdateRenderer
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
      NODE_ENV: process.env.NODE_ENV || env || 'development'
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
