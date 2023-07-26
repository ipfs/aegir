/* eslint-disable max-depth */

import fs from 'fs'
import path from 'path'
import { RendererEvent, ReflectionKind } from 'typedoc'
import { parseProjects } from '../utils.js'

/**
 * The types of models we want to store documentation URLs for
 */
const MODELS = [
  ReflectionKind.Interface,
  ReflectionKind.Function,
  ReflectionKind.TypeAlias,
  ReflectionKind.Variable,
  ReflectionKind.Class,
  ReflectionKind.Enum
]

/**
 * @typedef {object} Documentation
 * @property {string} moduleName
 * @property {Record<string, string>} Documentation.typedocs
 * @property {string[]} Documentation.exported
 * @property {string} [Documentation.outputDir]
 *
 * @typedef {import('../utils.js').Project} Project
 * @typedef {import('typedoc/dist/lib/models/reflections').DeclarationReflection} DeclarationReflection
 */

/**
 * A plugin that creates a `typedoc-urls.json` file in the `dist` folder of the
 * current project that contains URLs that map exported symbol names to published
 * typedoc pages.
 *
 * See `unknown-symbol-resolver-plugin.js` for how it is consumed.
 *
 * @param {import("typedoc/dist/lib/application").Application} Application
 */
export function load (Application) {
  const manifestPath = `${process.cwd()}/package.json`
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  const isMonorepo = Boolean(manifest.workspaces)

  // workaround for https://github.com/TypeStrong/typedoc/issues/2338
  /** @type {Record<string, Project>} */
  let projects = {}

  if (isMonorepo) {
    projects = parseProjects(process.cwd(), manifest.workspaces)
  }

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
      Application.logger.warn('No urls found in RendererEvent')
      return
    }

    /** @type {Record<string, Documentation>} */
    const typedocs = {}

    for (const urlMapping of event.urls) {
      if (!urlMapping.model.sources || urlMapping.model.sources.length === 0) {
        Application.logger.info(`No sources found in URLMapping for variant "${urlMapping.model.variant}"`)
        continue
      }

      if (!MODELS.includes(urlMapping.model.kind)) {
        Application.logger.info(`Skipping model "${urlMapping.model.variant}" as it is not in the list of model types we are interested in`)
        continue
      }

      if (urlMapping.model.sources == null || urlMapping.model.sources.length === 0) {
        Application.logger.info(`Skipping model "${urlMapping.model.variant}" as it has no url mapping sources`)
        continue
      }

      const source = urlMapping.model.sources[0]

      // workaround for https://github.com/TypeStrong/typedoc/issues/2338
      if (!path.isAbsolute(source.fullFileName)) {
        // did we get lucky?
        const p = path.join(process.cwd(), source.fullFileName)

        if (fs.existsSync(p)) {
          source.fullFileName = p
        } else {
          const project = findParentProject(urlMapping.model)

          if (project == null) {
            Application.logger.warn(`Full file name "${source.fullFileName}" was not absolute but could not detect containing module definition - see https://github.com/TypeStrong/typedoc/issues/2338`)
            continue
          }

          const projectDir = projects[project.name]?.dir

          if (projectDir == null) {
            Application.logger.warn(`Full file name "${source.fullFileName}" was not absolute but could not find containing project "${project.name}" - see https://github.com/TypeStrong/typedoc/issues/2338`)
            continue
          } else {
            const fullFileName = `${projectDir}/src/${source.fullFileName}`

            if (fs.existsSync(fullFileName)) {
              Application.logger.info(`Full file name of source was not absolute, overriding ${source.fullFileName} -> ${fullFileName} - see https://github.com/TypeStrong/typedoc/issues/2338`)

              source.fullFileName = fullFileName
            } else {
              Application.logger.warn(`Full file name "${source.fullFileName}" was not absolute, found containing project but could not locate source file in project - see https://github.com/TypeStrong/typedoc/issues/2338`)
              continue
            }
          }
        }
      }

      const context = findContext(source, isMonorepo)

      // set up manifest to contain typedoc urls
      if (typedocs[context.manifestPath] == null) {
        const details = loadManifest(Application, context)

        if (details == null) {
          continue
        }

        typedocs[context.manifestPath] = details
      }

      // cannot differentiate between types with duplicate names in the same module https://github.com/TypeStrong/typedoc/issues/2125
      if (typedocs[context.manifestPath].typedocs[urlMapping.model.name] != null) {
        Application.logger.warn(`Duplicate exported type name ${urlMapping.model.name} defined in ${urlMapping.model.sources[0].fullFileName}`)
      } else {
        // store reference to generate doc url
        typedocs[context.manifestPath].typedocs[urlMapping.model.name] = `${ghPages}${urlMapping.url}`
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

      Application.logger.info(`Wrote typedoc URLs to ${context.outputDir}/typedoc-urls.json`)
    })

    if (Object.keys(typedocs).length === 0) {
      Application.logger.warn('No typedoc-urls.json written!')
    }
  }

  Application.renderer.on(RendererEvent.BEGIN, onRendererBegin)
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

/**
 * @param {any} model
 * @param {Set<any>} seen
 * @returns {DeclarationReflection | undefined}
 */
function findParentProject (model, seen = new Set()) {
  const parent = model.parent

  if (seen.has(parent)) {
    return
  } else {
    seen.add(parent)
  }

  if (parent.kind === ReflectionKind.Module) {
    return parent
  }

  return findParentProject(parent, seen)
}
