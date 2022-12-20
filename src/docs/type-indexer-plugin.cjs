const fs = require('fs')
const { RendererEvent } = require('typedoc')
const path = require('path')

/**
 * The types of models we want to store documentation URLs for
 */
const MODELS = [
  'Interface',
  'Function',
  'Type alias',
  'Variable',
  'Class'
]

/**
 * @typedef {object} Documentation
 * @property {string} moduleName
 * @property {Record<string, string>} Documentation.typedocs
 * @property {string[]} Documentation.exported
 * @property {string} [Documentation.outputDir]
 */

/**
 * A plugin that creates a `typedoc-urls.json` file in the `dist` folder of the
 * current project that contains URLs that map exported symbol names to published
 * typedoc pages.
 *
 * See `unknown-symbol-resolver-plugin.cjs` for how it is consumed.
 *
 * @param {import("typedoc/dist/lib/application").Application} Application
 */
function load (Application) {
  const manifestPath = `${process.cwd()}/package.json`
  const manifest = require(manifestPath)
  const isMonorepo = Boolean(manifest.workspaces)

  /** @type {string} */
  let ghPages

  try {
    // find gh-pages url
    const homepage = new URL(manifest.homepage)
    const [orgName, moduleName] = homepage.pathname.split('/').filter(Boolean)
    ghPages = `https://${orgName}.github.io/${moduleName}/`
  } catch (err) {
    Application.logger.error('Could not detect gh-pages url - does the package.json have a valid homepage key?')
    throw err
  }

  /**
   * @param {import("typedoc/dist/lib/output/events").RendererEvent} event
   */
  const onRendererBegin = event => {
    if (!event.urls) {
      return
    }

    /** @type {Record<string, Documentation>} */
    const typedocs = {}

    for (const urlMapping of event.urls) {
      if (!urlMapping.model.sources || urlMapping.model.sources.length === 0) {
        continue
      }

      if (!MODELS.includes(urlMapping.model.kindString)) {
        continue
      }

      const context = findContext(urlMapping, isMonorepo)

      // set up manifest to contain typedoc urls
      if (typedocs[context.manifestPath] == null) {
        const details = loadManifest(Application, context)

        if (details == null) {
          continue
        }

        typedocs[context.manifestPath] = details
      }

      if (typedocs[context.manifestPath].typedocs[urlMapping.model.originalName] != null) {
        Application.logger.warn(`Duplicate exported type name ${urlMapping.model.originalName} defined in ${urlMapping.model.sources[0].fullFileName}`)
      } else {
        // store reference to generate doc url
        typedocs[context.manifestPath].typedocs[urlMapping.model.originalName] = `${ghPages}${urlMapping.url}`
      }
    }

    Object.keys(typedocs).forEach(manifestPath => {
      const context = typedocs[manifestPath]

      // skip dependency contexts
      if (context.outputDir == null) {
        return
      }

      fs.mkdirSync(context.outputDir, {
        recursive: true
      })
      fs.writeFileSync(`${context.outputDir}/typedoc-urls.json`, JSON.stringify(context.typedocs, null, 2))
    })
  }

  Application.renderer.on(RendererEvent.BEGIN, onRendererBegin)
}

module.exports = {
  load
}

/**
 * @typedef {object} ProjectContext
 * @property {string} [ProjectContext.outputDir]
 * @property {string} ProjectContext.manifestPath
 */

/**
 * For a given UrlMapping, find the nearest package.json file
 * and work out if a `typedoc-urls.json` should be generated.
 *
 * @param {import("typedoc/dist/lib/output/models/UrlMapping").UrlMapping} mapping
 * @param {boolean} isMonorepo
 * @returns {ProjectContext}
 */
function findContext (mapping, isMonorepo) {
  const sources = mapping.model.sources

  if (sources == null || sources.length === 0 || sources[0].fullFileName == null) {
    throw new Error('UrlMapping had no sources')
  }

  const absolutePathSegments = sources[0].fullFileName.split('/')

  while (absolutePathSegments.length) {
    // remove last path segment
    absolutePathSegments.pop()

    let manifestPath = makeAbsolute(path.join(...absolutePathSegments, 'package.json'))

    /** @type {string | undefined} */
    let outputDir = makeAbsolute(path.join(...(isMonorepo ? absolutePathSegments : process.cwd().split('/')), 'dist'))

    // this can occur when a symbol from a dependency is exported, if this is
    // the case do not try to write a `typedoc-urls.json` file
    if (sources[0].fullFileName.includes('node_modules')) {
      outputDir = undefined
    }

    if (fs.existsSync(manifestPath)) {
      return {
        outputDir,
        manifestPath
      }
    }
  }

  throw new Error('Could not locate package.json for UrlMapping')
}

/**
 * @param {import("typedoc/dist/lib/application").Application} Application
 * @param {ProjectContext} context
 * @returns {Documentation | undefined}
 */
function loadManifest (Application, context) {
  const manifest = JSON.parse(fs.readFileSync(context.manifestPath, 'utf-8'))

  if (manifest.exports === null) {
    // read exports map
    Application.logger.warn(`Project ${manifest.name} has no exports map`)
    return
  }

  // store a list of all files exported by this project
  /** @type {string[]} */
  const exported = []

  Object.keys(manifest.exports ?? {}).forEach(name => {
    if (manifest.exports[name].import == null) {
      Application.logger.warn(`Project export ${name} has no import field`)
      return
    }

    exported.push(manifest.exports[name].import)
  })

  return {
    moduleName: manifest.name,
    exported,
    typedocs: {},
    outputDir: context.outputDir
  }
}

/**
 * Make a path absolute
 *
 * @param {string} p
 * @returns {string}
 */
function makeAbsolute (p) {
  // on windows it is already absolute
  if (!p.startsWith('/') && process.platform !== 'win32') {
    return `/${p}`
  }

  return p
}
