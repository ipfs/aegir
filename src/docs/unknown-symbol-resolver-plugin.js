import fs from 'fs'
import path from 'path'

/** @type {Record<string, Record<string, string>>} */
const knownSymbols = {
  '@types/chai': {
    'Chai.ChaiStatic': 'https://www.chaijs.com/api/',
    'Chai.Assertion': 'https://www.chaijs.com/api/assert/'
  },
  '@types/mocha': {
    'NodeJS.EventEmitter': 'https://nodejs.org/dist/latest-v19.x/docs/api/events.html#class-eventemitter'
  },
  '@types/node': {
    EventEmitter: 'https://nodejs.org/dist/latest-v19.x/docs/api/events.html#class-eventemitter',
    'NodeJS.EventEmitter': 'https://nodejs.org/dist/latest-v19.x/docs/api/events.html#class-eventemitter',
    Server: 'https://nodejs.org/dist/latest-v19.x/docs/api/net.html#class-netserver',
    IncomingMessage: 'https://nodejs.org/dist/latest-v19.x/docs/api/http.html#class-httpincomingmessage',
    ServerResponse: 'https://nodejs.org/dist/latest-v19.x/docs/api/http.html#class-httpserverresponse',
    'global.NodeJS.ReadStream': 'https://nodejs.org/dist/latest-v19.x/docs/api/tty.html#class-ttyreadstream',
    'global.NodeJS.WriteStream': 'https://nodejs.org/dist/latest-v19.x/docs/api/tty.html#class-ttywritestream',
    'global.NodeJS.ProcessEnv': 'https://nodejs.org/dist/latest-v19.x/docs/api/process.html#processenv',
    'internal.Duplex': 'https://nodejs.org/dist/latest-v19.x/docs/api/stream.html#class-streamduplex',
    'internal.Readable': 'https://nodejs.org/dist/latest-v19.x/docs/api/stream.html#class-streamreadable',
    'internal.Transform': 'https://nodejs.org/dist/latest-v19.x/docs/api/stream.html#class-streamtransform',
    'internal.Writable': 'https://nodejs.org/dist/latest-v19.x/docs/api/stream.html#class-streamwritable'
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
 * @param {import("typedoc/dist/lib/application").Application} Application
 */
export function load (Application) {
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

    return `https://www.npmjs.com/package/${moduleName}`
  })
}

/**
 * @param {string} moduleName
 */
function loadTypedocUrls (moduleName) {
  const parts = process.cwd().split('/')

  while (parts.length > 0) {
    const typedocUrls = path.join(...parts, 'node_modules', moduleName, 'dist', 'typedoc-urls.json')

    if (fs.existsSync(typedocUrls)) {
      return JSON.parse(fs.readFileSync(typedocUrls, 'utf-8'))
    }

    parts.pop()
  }

  return {}
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
