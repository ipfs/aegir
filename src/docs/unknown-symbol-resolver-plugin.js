import fs from 'fs'
import path from 'path'

/** @type {Record<string, Record<string, string>>} */
const knownSymbols = {
  '@types/chai': {
    'Chai.ChaiStatic': 'https://www.chaijs.com/api/',
    'Chai.Assertion': 'https://www.chaijs.com/api/assert/'
  },
  '@types/mocha': {
    'NodeJS.EventEmitter': 'https://nodejs.org/dist/latest/docs/api/events.html#class-eventemitter'
  },
  '@types/node': {
    EventEmitter: 'https://nodejs.org/dist/latest/docs/api/events.html#class-eventemitter',
    'NodeJS.EventEmitter': 'https://nodejs.org/dist/latest/docs/api/events.html#class-eventemitter',
    Server: 'https://nodejs.org/dist/latest/docs/api/net.html#class-netserver',
    IncomingMessage: 'https://nodejs.org/dist/latest/docs/api/http.html#class-httpincomingmessage',
    '"http".IncomingMessage': 'https://nodejs.org/dist/latest/docs/api/http.html#class-httpincomingmessage',
    '"http".Server': 'https://nodejs.org/dist/latest/docs/api/http.html#class-httpserver',
    ServerResponse: 'https://nodejs.org/dist/latest/docs/api/http.html#class-httpserverresponse',
    '"http".ServerResponse': 'https://nodejs.org/dist/latest/docs/api/http.html#class-httpserverresponse',
    'global.NodeJS.ReadStream': 'https://nodejs.org/dist/latest/docs/api/tty.html#class-ttyreadstream',
    'global.NodeJS.WriteStream': 'https://nodejs.org/dist/latest/docs/api/tty.html#class-ttywritestream',
    'global.NodeJS.ProcessEnv': 'https://nodejs.org/dist/latest/docs/api/process.html#processenv',
    'internal.Duplex': 'https://nodejs.org/dist/latest/docs/api/stream.html#class-streamduplex',
    'internal.Readable': 'https://nodejs.org/dist/latest/docs/api/stream.html#class-streamreadable',
    'internal.Transform': 'https://nodejs.org/dist/latest/docs/api/stream.html#class-streamtransform',
    'internal.Writable': 'https://nodejs.org/dist/latest/docs/api/stream.html#class-streamwritable'
  },
  esbuild: {
    BuildOptions: 'https://esbuild.github.io/api/#build-api'
  }
}

// these are handled by the plugin typedoc-plugin-mdn-links
const ignoreModules = [
  'typescript'
]

/**
 * A plugin that attempts to supply typedoc links for symbol names. It will load
 * `typedoc-urls.json` files from the `dist` folder of types that need
 * documenting. See `type-indexer-plugin.cjs` for how this file is generated.
 *
 * @param {import('typedoc').Application} app
 */
export function load (app) {
  app.converter.addUnknownSymbolResolver((ref, refl, part, symbolId) => {
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

    /** @type {string | undefined} */
    let typeDocPath

    if (symbolId != null) {
      const fileName = symbolId.fileName ?? ''
      const importPath = resolveImportPath(fileName)

      if (importPath != null) {
        typeDocPath = `${importPath}:${symbolName}`
      } else {
        app.logger.verbose(`Could not resolve import path for symbol ${symbolName} from module ${moduleName} using file name ${fileName}`)
      }
    }

    // try to load docs from package.json - if the manifest declares a
    // `docs` key use that to look up links to typedocs
    const typedocs = loadTypedocUrls(moduleName)

    // attempt to use the canonical documentation URL
    if (typeDocPath != null && typedocs[typeDocPath] != null) {
      return typedocs[typeDocPath]
    }

    // fall back to plain symbol name, may not be the canonical documentation URL
    if (typedocs[symbolName] != null) {
      return typedocs[symbolName]
    }

    app.logger.warn(`Unknown symbol ${symbolName} from module ${moduleName}`)

    return `https://www.npmjs.com/package/${moduleName}`
  })
}

/**
 * @param {string} moduleName
 * @returns {Record<string, string>}
 */
function loadTypedocUrls (moduleName) {
  const parts = process.cwd().split('/')
  let modulePath = ''

  while (parts.length > 0) {
    modulePath = path.join(...parts, 'node_modules', moduleName)

    const typedocUrls = path.join(modulePath, 'dist', 'typedoc-urls.json')

    if (fs.existsSync(typedocUrls)) {
      return JSON.parse(fs.readFileSync(typedocUrls, 'utf-8'))
    }

    parts.pop()
  }

  return {}
}

/**
 * @param {import("typedoc").ComponentPath[] | undefined} refs
 */
function calculateName (refs) {
  if (refs == null || refs.length === 0) {
    return
  }

  return refs.map(ref => ref.path).join('.')
}

/**
 * Load the closest package.json to the passed file with an exports map and
 * attempt to detect the exports map entry that the file was imported from
 *
 * @param {string} fileName
 * @returns {string | undefined}
 */
function resolveImportPath (fileName) {
  if (!path.isAbsolute(fileName)) {
    fileName = path.join(process.cwd(), fileName)
  }

  const parts = fileName.split('/')
  parts.pop()

  // find closest package.json to the imported file
  while (parts.length > 0) {
    const dirPath = path.join('/', ...parts)
    const manifestPath = path.join(dirPath, 'package.json')

    if (!fs.existsSync(manifestPath)) {
      parts.pop()
      continue
    }

    const sourcePath = fileName.replace(dirPath, '.')

    // load manifest
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

    if (manifest.exports == null) {
      parts.pop()
      continue
    }

    for (const [name, entry] of Object.entries(manifest.exports)) {
      if (entry.import === sourcePath || entry.types === sourcePath) {
        return name
      }
    }

    return
  }
}
