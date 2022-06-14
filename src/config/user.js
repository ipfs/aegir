/* eslint-disable no-console */
import { lilconfig } from 'lilconfig'
import merge from 'merge-options'
import { pathToFileURL } from 'url'
import tsImport from 'ts-import'

import { defaults } from './defaults.js'

/**
 * @typedef {import('../types').Options} Options
 * @typedef {import('../types').PartialOptions} PartialOptions
 * @typedef {(filepath: string) => Promise<PartialOptions | null>} Loader
 */

/**
 *
 * @param {{default?: PartialOptions} | PartialOptions} mod
 * @param {string} configFilePath
 *
 * @returns {PartialOptions | null}
 */
const handleConfigImport = (mod, configFilePath) => {
  const modWithDefaultExport = /** @type {{default?: PartialOptions}} */(mod)
  if (modWithDefaultExport.default != null) {
    return modWithDefaultExport.default
  }

  if (typeof mod.toString === 'function') {
    return /** @type {PartialOptions} */(mod)
  }

  if (typeof mod === 'object' && typeof mod.toString === 'undefined' && Object.keys(mod).length === 0) {
    // nothing is exported.
    throw new Error(`Nothing is exported in your config file '${configFilePath}'. Please export your configuration as the default export`)
  }

  throw new Error(`Incorrectly exported configuration from '${configFilePath}'`)
}

/**
 * @type {Loader}
 */
const loadEsm = async (filepath) => {
  let res
  try {
    res = await import(pathToFileURL(filepath).toString())
  } catch (err) {
    console.error('Unexpected error while importing your config file')
    throw err
  }

  return handleConfigImport(res, filepath)
}

/**
 * @type {Loader}
 */
const loadTs = async (filepath) => {
  let res
  try {
    res = await tsImport.load(filepath)
  } catch (err) {
    console.error('Unexpected error while loading your config file')
    throw err
  }

  return handleConfigImport(res, filepath)
}

/**
 * @type {Loader}
 */
const noExt = async (filepath) => {
  try {
    return await loadEsm(filepath)
  } catch (err) {
    try {
      return await loadTs(filepath)
    } catch (err) {
      console.error(`Could not load your config file at '${filepath}'`)
      console.error(err, err)
      throw new Error(`Could not load your no-extension aegir config file at '${filepath}' as ESM nor TS`)
    }
  }
}

/**
 * We should only be grabbing the config once per search location
 *
 * @type {Map<string | undefined, Options>}
 */
const cachedConfig = new Map()

/**
 * Search for local user config
 *
 * @param {string | undefined} [searchFrom]
 *
 * @returns {Promise<Options>}
 */
export const config = async (searchFrom) => {
  if (cachedConfig.has(searchFrom)) {
    return /** @type {Options} */(cachedConfig.get(searchFrom))
  }
  /**
   * @type {PartialOptions}
   */
  let userConfig
  try {
    const loadedConfig = await lilconfig('aegir', {
      loaders: {
        '.js': loadEsm,
        '.mjs': loadEsm,
        '.ts': loadTs,
        noExt
      },
      searchPlaces: [
        'package.json',
        '.aegir.js',
        '.aegir.cjs',
        '.aegir.ts',
        '.aegir'
      ]
    })
      .search(searchFrom)

    if (loadedConfig) {
      userConfig = loadedConfig.config
    } else {
      userConfig = {}
    }
  } catch (err) {
    console.error('Unexpected error loading aegir config')
    throw err
  }

  const conf = /** @type {Options} */(merge(
    defaults,
    userConfig
  ))

  cachedConfig.set(searchFrom, conf)

  return conf
}

export const loadUserConfig = config
