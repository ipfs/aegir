/* eslint-disable no-console */

import { pathToFileURL } from 'url'
import { lilconfig } from 'lilconfig'

/**
 * @typedef {import("./../types").Options} Options
 */

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

  return userConfig
}

export const loadUserConfig = () => config()
