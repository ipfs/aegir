/* eslint-disable max-depth */

import fs from 'fs'
import path from 'path'
import * as td from 'typedoc'

const MODELS =
  td.ReflectionKind.Interface |
  td.ReflectionKind.Function |
  td.ReflectionKind.TypeAlias |
  td.ReflectionKind.Variable |
  td.ReflectionKind.Class |
  td.ReflectionKind.Enum

/**
 * @typedef {object} Documentation
 * @property {string} moduleName
 * @property {Record<string, string>} Documentation.typedocs
 * @property {Record<string, string>} Documentation.exports
 * @property {string} [Documentation.outputDir]
 *
 * @typedef {import('../utils.js').Project} Project
 * @typedef {td.DeclarationReflection} DeclarationReflection
 */

/**
 * A plugin that creates a `typedoc-urls.json` file in the `dist` folder of the
 * current project that contains URLs that map exported symbol names to published
 * typedoc pages.
 *
 * See `unknown-symbol-resolver-plugin.js` for how it is consumed.
 *
 * @param {td.Application} app
 */
export function load (app) {
  const manifestPath = `${process.cwd()}/package.json`
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  const isMonorepo = Boolean(manifest.workspaces)

  /** @type {string} */
  let ghPages

  try {
    // find gh-pages url
    const homepage = new URL(manifest.homepage)
    const [orgName, moduleName] = homepage.pathname.split('/').filter(Boolean)
    ghPages = `https://${orgName}.github.io/${moduleName}/`
  } catch (err) {
    app.logger.error('Could not detect gh-pages url - does the package.json have a valid homepage key?')
    throw err
  }

  /**
   * @param {import("typedoc/dist/lib/output/events").RendererEvent} event
   */
  const onRendererBegin = event => {
    if (!event.urls) {
      app.logger.warn('No urls found in RendererEvent')
      return
    }

    /** @type {Record<string, Documentation>} */
    const typedocs = {}

    for (const urlMapping of event.urls) {
      // @ts-expect-error sources is not a property of Reflection
      if (!urlMapping.model.sources || urlMapping.model.sources.length === 0) {
        app.logger.verbose(`No sources found in URLMapping for variant "${urlMapping.model.variant}"`)
        continue
      }

      if (!urlMapping.model.kindOf(MODELS)) {
        app.logger.verbose(`Skipping model "${urlMapping.model.variant}" as it is not in the list of model types we are interested in`)
        continue
      }

      // @ts-expect-error sources is not a property of Reflection
      if (urlMapping.model.sources == null || urlMapping.model.sources.length === 0) {
        app.logger.verbose(`Skipping model "${urlMapping.model.variant}" as it has no url mapping sources`)
        continue
      }

      // @ts-expect-error sources is not a property of Reflection
      const source = urlMapping.model.sources[0]

      // @ts-expect-error reflectionSources is not a property of ProjectReflection
      source.fullFileName = event.project.reflectionSources[urlMapping.model.id]

      const context = findContext(source, isMonorepo)

      // skip dependencies to avoid exhausting memory
      if (context.manifestPath.includes('node_modules')) {
        continue
      }

      // set up manifest to contain typedoc urls
      if (typedocs[context.manifestPath] == null) {
        const details = loadManifest(app, context)

        if (details == null) {
          continue
        }

        typedocs[context.manifestPath] = details
      }

      // work out which exports map entry this symbol can be imported from
      const manifestDir = path.dirname(context.manifestPath)
      let defPath = source.fullFileName.replace(manifestDir, '')

      if (defPath.endsWith('.ts')) {
        defPath = defPath.replace(/(\.d)?\.ts$/, '.js')
        if (!defPath.startsWith('/dist')) {
          defPath = `/dist${defPath}`
        }
      }

      defPath = `.${defPath}`
      const exportPath = typedocs[context.manifestPath].exports[defPath]

      // cannot differentiate between types with duplicate names in the same module https://github.com/TypeStrong/typedoc/issues/2125
      if (typedocs[context.manifestPath].typedocs[urlMapping.model.name] != null) {
        // @ts-expect-error sources is not a property of Reflection
        app.logger.warn(`Duplicate exported type name ${urlMapping.model.name} defined in ${urlMapping.model.sources[0].fullFileName}`)
      } else {
        // store reference to generate doc url
        typedocs[context.manifestPath].typedocs[urlMapping.model.name] = `${ghPages}${urlMapping.url}`
      }

      // if the export map entry that this symbol can be loaded from is present,
      // store it in the typedoc url list so we can attempt to choose a
      // canonical documentation URL when duplicate symbol names are exported
      if (exportPath != null) {
        typedocs[context.manifestPath].typedocs[`${exportPath}:${urlMapping.model.name}`] = `${ghPages}${urlMapping.url}`
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

      app.logger.info(`Wrote typedoc URLs to ${context.outputDir}/typedoc-urls.json`)
    })

    if (Object.keys(typedocs).length === 0) {
      app.logger.warn('No typedoc-urls.json written!')
    }
  }

  app.converter.on(td.Converter.EVENT_RESOLVE, onResolve)

  app.serializer.addSerializer({
    priority: 0,
    supports (model) {
      return model instanceof td.ProjectReflection
    },
    toObject (model, obj, _ser) {
      obj.reflectionSources = model.reflectionSources
      return obj
    }
  })
  app.deserializer.addDeserializer({
    priority: 0,
    supports (_model, obj) {
      // @ts-expect-error obj is unknown type
      return typeof obj.reflectionSources === 'object'
    },
    fromObject (_model, obj) {
      app.deserializer.defer((project) => {
        // @ts-expect-error reflectionSources is not a property of ProjectReflection
        project.reflectionSources ??= {}

        // @ts-expect-error obj is unknown type
        for (const [id, path] of Object.entries(obj.reflectionSources)) {
          // @ts-expect-error reflectionSources is not a property of ProjectReflection
          project.reflectionSources[app.deserializer.oldIdToNewId[id]] = path
        }
      })
    }
  })

  app.renderer.on(td.RendererEvent.BEGIN, onRendererBegin)
}

/**
 * @param {td.Context} context
 * @param {td.DeclarationReflection} decl
 */
function onResolve (context, decl) {
  if (!decl.kindOf(MODELS)) {
    return
  }

  const symbol = context.project.getSymbolFromReflection(decl)

  if (!symbol) {
    return
  }

  const declarations = symbol.declarations

  if (!declarations) {
    return
  }

  // @ts-expect-error reflectionSources is not a property of ProjectReflection
  context.project.reflectionSources ??= {}
  // @ts-expect-error reflectionSources is not a property of ProjectReflection
  context.project.reflectionSources[decl.id] = declarations[0].getSourceFile().fileName
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
 * @param {import("typedoc/dist/lib/models/sources/file").SourceReference} source
 * @param {boolean} isMonorepo
 * @returns {ProjectContext}
 */
function findContext (source, isMonorepo) {
  const absolutePathSegments = source.fullFileName.split('/')

  while (absolutePathSegments.length) {
    // remove last path segment
    absolutePathSegments.pop()

    const manifestPath = makeAbsolute(path.join(...absolutePathSegments, 'package.json'))

    /** @type {string | undefined} */
    let outputDir = makeAbsolute(path.join(...(isMonorepo ? absolutePathSegments : process.cwd().split('/')), 'dist'))

    // this can occur when a symbol from a dependency is exported, if this is
    // the case do not try to write a `typedoc-urls.json` file
    if (source.fullFileName.includes('node_modules')) {
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
  /** @type {Record<string, string>} */
  const exports = {}

  if (manifest.exports != null) {
    if (typeof manifest.exports === 'string') {
      exports[manifest.exports] = '.'
    } else {
      Object.keys(manifest.exports).forEach(name => {
        if (typeof manifest.exports[name] === 'string') {
          exports[manifest.exports[name]] = name
          return
        }

        if (manifest.exports[name].import == null) {
          Application.logger.warn(`Project export ${name} has no import field`)
          return
        }

        exports[manifest.exports[name].import] = name
      })
    }
  }

  return {
    moduleName: manifest.name,
    exports,
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
