const fs = require('fs')
const { RendererEvent } = require('typedoc')

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

  // find gh-pages url
  const homepage = new URL(manifest.homepage)
  const [orgName, moduleName] = homepage.pathname.split('/').filter(Boolean)
  const ghPages = `https://${orgName}.github.io/${moduleName}/`

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
      if (typedocs[context.manifestAbsolutePath] == null) {
        const details = loadManifest(Application, context)

        if (details == null) {
          continue
        }

        typedocs[context.manifestAbsolutePath] = details
      }

      const source = toExportPath(urlMapping, isMonorepo, context)

      if (!typedocs[context.manifestAbsolutePath].exported.includes(source)) {
        Application.logger.info(`Skipping ${source} as it is not in the project exports of ${typedocs[context.manifestAbsolutePath].moduleName}`)

        continue
      }

      // store reference to generate doc url
      typedocs[context.manifestAbsolutePath].typedocs[urlMapping.model.originalName] = `${ghPages}${urlMapping.url}`
    }

    Object.keys(typedocs).forEach(manifestPath => {
      const context = typedocs[manifestPath]

      // skip dependency contexts
      if (context.outputDir == null) {
        return
      }

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
 * @property {string} ManifestDocRef.localProjectDir
 * @property {string} [ProjectContext.outputDir]
 * @property {string} ProjectContext.manifestAbsolutePath
 */

/**
 * Return project details for the passed UrlMapping
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
  const localPathSegments = sources[0].fileName.split('/')

  while (absolutePathSegments.length) {
    // remove last path segment
    absolutePathSegments.pop()
    localPathSegments.pop()

    const manifestPath = `${absolutePathSegments.join('/')}/package.json`

    /** @type {string | undefined} */
    let outputDir = `${process.cwd()}${isMonorepo ? `/${localPathSegments.join('/')}` : ''}/dist`

    if (localPathSegments[0] === 'node_modules') {
      outputDir = undefined
    }

    if (fs.existsSync(manifestPath)) {
      return {
        localProjectDir: localPathSegments.join('/'),
        outputDir,
        manifestAbsolutePath: manifestPath
      }
    }
  }

  throw new Error('Could not locate package.json for UrlMapping')
}

/**
 * Return the path of the passed mapping relative to the current project
 * @param {import("typedoc/dist/lib/output/models/UrlMapping").UrlMapping} mapping
 * @param {boolean} isMonorepo
 * @param {ProjectContext} context
 */
function toExportPath (mapping, isMonorepo, context) {
  let source = mapping.model.sources[0].fullFileName.replace(`${process.cwd()}/`, '')

  if (context.localProjectDir != '') {
    // make source path local to monorepo project
    source = source.replace(context.localProjectDir + '/', '')
  }

  if (source.endsWith('.d.ts')) {
    // convert to exports type
    source = `${source.substring(0, source.length - 5)}.js`

    // prepend source destination
    source = `src/${source}`
  }

  if (source.endsWith('.ts')) {
    // convert to exports type
    source = `${source.substring(0, source.length - 3)}.js`

    // prepend transpiled destination
    source = `dist/${source}`
  }

  if (!source.startsWith('./')) {
    source = `./${source}`
  }

  return source
}

/**
 * @param {import("typedoc/dist/lib/application").Application} Application
 * @param {ProjectContext} context
 * @returns {Documentation | undefined}
 */
function loadManifest (Application, context) {
  const manifest = JSON.parse(fs.readFileSync(context.manifestAbsolutePath, 'utf-8'))

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
