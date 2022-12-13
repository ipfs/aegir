const fs = require('fs')

/** @type {Record<string, Record<string, string>>} */
const knownSymbols = {
  '@types/chai': {
    'Chai.ChaiStatic': 'https://www.chaijs.com/api/',
    'Chai.Assertion': 'https://www.chaijs.com/api/assert/'
  }
}

// these are handled by the plugin typedoc-plugin-mdn-links
const ignoreModules = [
  'typescript',
  '@types/node'
]

/**
 * A plugin that attempts to supply typedoc links for symbol names. It will load
 * `typedoc-urls.json` files from the `dist` folder of types that need
 * documenting. See `type-indexer-plugin.cjs` for how this file is generated.
 *
 * @param {import("typedoc/dist/lib/application").Application} Application
 */
function load(Application) {
  Application.converter.addUnknownSymbolResolver((ref) => {
      const moduleName = ref.moduleSource
      const symbolName = calculateName(ref.symbolReference?.path)

      if (moduleName == null || symbolName == null) {
        // can't resolve symbol
        return
      }

      if (ignoreModules.includes(moduleName)) {
        return
      }

      const moduleDocs = knownSymbols[moduleName]

      // do we know about this module
      if (moduleDocs != null && moduleDocs[symbolName] != null) {
        return moduleDocs[symbolName]
      }

      // try to load docs from package.json - if the manifest declares a
      // `docs` key use that to look up links to typedocs
      const typedocs = loadTypedocUrls(moduleName)

      if (typedocs[symbolName] != null) {
        return typedocs[symbolName]
      }

      Application.logger.warn(`Unknown symbol ${symbolName} from module ${moduleName}`)
    })
}

module.exports = {
  load
}

/**
 * @param {string} moduleName
 */
function loadTypedocUrls (moduleName) {
  try {
    return require(`${moduleName}/dist/typedoc-urls.json`)
  } catch (/** @type {any} */ err) {
    if (err.message.includes('Cannot find module')) {
      // typedoc-urls did not exist in module with main field
      return {}
    }

    if (err.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
      throw err
    }

    // try to load manifest from module with only exports map
    const match = err.message.match(/ in (.*)$/)

    if (match.length > 1) {
      const manifestPath = match[1].trim()
      const docUrlsPath = manifestPath.replace('package.json', 'dist/typedoc-urls.json')

      if (!fs.existsSync(docUrlsPath)) {
        return {}
      }

      return JSON.parse(fs.readFileSync(docUrlsPath, 'utf-8'))
    }

    throw err
  }
}

/**
 * @param {import("typedoc/dist/lib/converter/comments/declarationReference").ComponentPath[] | undefined} refs
 */
function calculateName (refs) {
  if (refs == null || refs.length === 0) {
    return
  }

  return refs.map(ref => ref.path).join('.')
}
