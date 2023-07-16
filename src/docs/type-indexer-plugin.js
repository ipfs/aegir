import fs from 'fs'
import path from 'path'
import { RendererEvent, ReflectionKind } from 'typedoc'

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
        Application.logger.verbose(`No sources found in URLMapping for variant "${urlMapping.model.variant}"`)
        continue
      }

      if (!MODELS.includes(urlMapping.model.kind)) {
        Application.logger.verbose(`Skipping model "${urlMapping.model.variant}" as it is not in the list of model types we are interested in`)
        continue
      }

      if (urlMapping.model.sources == null || urlMapping.model.sources.length === 0) {
        Application.logger.verbose(`Skipping model "${urlMapping.model.variant}" as it has no url mapping sources`)
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
      Application.logger.warn('No typedoc URLs written!')
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
 * @param {import("typedoc/dist/lib/output/models/UrlMapping").UrlMapping} mapping
 * @param {boolean} isMonorepo
 * @returns {ProjectContext}
 */
function findContext (mapping, isMonorepo) {
  const sources = mapping.model.sources
  let absolutePathSegments = []

  if (path.isAbsolute(sources[0].fullFileName)) {
    absolutePathSegments = sources[0].fullFileName.split('/')
  } else {
    // fullFileName is absolute for regular projects, relative for monorepo projects so
    // use the URL instead to guess where the file is. Probably won't work on Windows.
    // https://github.com/TypeStrong/typedoc/issues/2338
    absolutePathSegments = findOverlap(process.cwd(), sources[0].url)
  }

  while (absolutePathSegments.length) {
    // remove last path segment
    absolutePathSegments.pop()

    const manifestPath = makeAbsolute(path.join(...absolutePathSegments, 'package.json'))

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

/**
 * @param {string} cwd
 * @param {string} url
 * @returns {string[]}
 */
function findOverlap (cwd, url) {
  const cwdParts = cwd.split('/')
  const urlParts = url
    // remove line number from url
    .split('#')[0]
    // remove github url
    .replace('https://github.com/', '')
    // turn into path segments
    .split('/')
    // remove org, repo, blob and commit-ish/branch name
    .slice(4)

  for (let i = 0; i < cwdParts.length; i++) {
    const cwdPart = cwdParts[i]

    if (urlParts[0] === cwdPart) {
      let urlIndex = 1
      let matches = true

      for (let n = i + 1; n < cwdPart.length; n++) {
        if (urlParts[urlIndex] !== cwdParts[n]) {
          matches = false
          break
        }

        urlIndex++
      }

      if (matches) {
        return cwdParts.slice(1, i).concat(urlParts)
      }
    }
  }

  throw new Error(`No overlap between ${cwd} and ${urlParts.join('/')}`)
}
