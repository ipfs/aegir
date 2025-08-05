/* eslint-disable no-console,complexity */

import path from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import fs from 'fs-extra'
import latestVersion from 'latest-version'
import Listr from 'listr'
import prompt from 'prompt'
import semver from 'semver'
import yargsParser from 'yargs-parser'
import {
  getSubProjectDirectories,
  isMonorepoProject,
  usesReleasePlease
} from '../utils.js'
import { checkBuildFiles } from './check-build-files.js'
import { checkLicenseFiles } from './check-licence-files.js'
import { checkMonorepoFiles } from './check-monorepo-files.js'
import { checkMonorepoReadme } from './check-monorepo-readme.js'
import { checkReadme } from './check-readme.js'
import { checkTypedocFiles } from './check-typedoc-files.js'
import { monorepoManifest } from './manifests/monorepo.js'
import { typedCJSManifest } from './manifests/typed-cjs.js'
import { typedESMManifest } from './manifests/typed-esm.js'
import { typescriptManifest } from './manifests/typescript.js'
import { untypedCJSManifest } from './manifests/untyped-cjs.js'
import { untypedESMManifest } from './manifests/untyped-esm.js'
import {
  sortManifest,
  ensureFileHasContents,
  calculateSiblingVersion
} from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string} projectDir
 */
async function getConfig (projectDir) {
  const branchName = await execa('git', ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], {
    cwd: projectDir
  })
    .catch(async err => {
      // if this repo was not clone from the origin, update the default
      // origin/HEAD and try again
      if (err.stderr.includes('ref refs/remotes/origin/HEAD is not a symbolic ref')) {
        await execa('git', ['remote', 'set-head', 'origin', '-a'], {
          cwd: projectDir
        })

        return await execa('git', ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], {
          cwd: projectDir
        })
      }

      throw err
    })
    .then(res => execa('basename', [res.stdout]))
    .then(res => res.stdout)
    .catch(() => {
      return 'main'
    })
  const repoUrl = await execa('git', ['remote', 'get-url', 'origin'], {
    cwd: projectDir
  })
    .then(res => res.stdout.split(':')[1].split('.git')[0])
    .then(res => `https://github.com/${res}`)
    .catch(() => {
      return ''
    })

  if (process.env.CI) {
    return {
      projectDir,
      branchName,
      repoUrl
    }
  }

  prompt.start()

  const res = await prompt.get({
    properties: {
      branchName: {
        default: branchName
      },
      repoUrl: {
        default: repoUrl
      }
    }
  })

  return {
    projectDir,
    branchName: res.branchName.toString(),
    repoUrl: res.repoUrl.toString()
  }
}

/**
 * @param {string} projectDir
 * @param {any} manifest
 * @param {string} branchName
 * @param {string} repoUrl
 * @param {string} ciFile
 */
async function processMonorepo (projectDir, manifest, branchName, repoUrl, ciFile) {
  const workspaces = manifest.workspaces

  if (!workspaces || !Array.isArray(workspaces)) {
    throw new Error('No monorepo workspaces found')
  }

  const projectDirs = []
  const webRoot = `${repoUrl}/tree/${branchName}`

  const { releaseType } = await prompt.get({
    properties: {
      releaseType: {
        description: 'Monorepo release type: semantic-release | release-please',
        required: true,
        conform: (value) => {
          return ['semantic-release', 'release-please'].includes(value)
        },
        default: usesReleasePlease() ? 'release-please' : 'semantic-release'
      }
    }
  })

  if (releaseType !== 'release-please' && releaseType !== 'semantic-release') {
    throw new Error('Invalid release type specified')
  }

  for (const subProjectDir of await getSubProjectDirectories(projectDir, workspaces)) {
    const stat = await fs.stat(subProjectDir)

    if (!stat.isDirectory()) {
      continue
    }

    const subProjectManifest = path.join(subProjectDir, 'package.json')

    if (!fs.existsSync(subProjectManifest)) {
      continue
    }

    const pkg = fs.readJSONSync(subProjectManifest)
    const homePage = `${webRoot}/${subProjectDir.includes(projectDir) ? subProjectDir.substring(projectDir.length) : subProjectDir}`

    console.info('Found monorepo project', pkg.name)

    await processModule({
      projectDir: subProjectDir,
      manifest: pkg,
      branchName,
      repoUrl,
      homePage,
      ciFile,
      rootManifest: manifest,
      releaseType
    })

    projectDirs.push(subProjectDir)
  }

  await alignMonorepoProjectDependencies(projectDirs)
  await configureMonorepoProjectReferences(projectDirs)

  let proposedManifest = await monorepoManifest({
    manifest,
    repoUrl,
    homePage: repoUrl,
    branchName,
    releaseType
  })
  proposedManifest = sortManifest(proposedManifest)

  await ensureFileHasContents(projectDir, 'package.json', JSON.stringify(proposedManifest, null, 2))
  await ensureFileHasContents(projectDir, '.gitignore', fs.readFileSync(path.join(__dirname, 'files', 'gitignore'), {
    encoding: 'utf-8'
  }))
  await checkLicenseFiles(projectDir)
  await checkBuildFiles(projectDir, branchName, repoUrl)
  await checkMonorepoReadme(projectDir, repoUrl, webRoot, branchName, projectDirs, ciFile)
  await checkMonorepoFiles(projectDir)
}

/**
 * @param {string[]} projectDirs
 */
async function alignMonorepoProjectDependencies (projectDirs) {
  /** @type {Record<string, string>} */
  const siblingVersions = {}
  /** @type {Record<string, string>} */
  const deps = {}

  // first loop over every project and choose the most recent version of a given dep
  for (const projectDir of projectDirs) {
    const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))
    siblingVersions[pkg.name] = calculateSiblingVersion(pkg.version)

    chooseVersions(pkg.dependencies ?? {}, deps)
    chooseVersions(pkg.devDependencies ?? {}, deps)
    chooseVersions(pkg.optionalDependencies ?? {}, deps)
    chooseVersions(pkg.peerDependencies ?? {}, deps)
  }

  // get the latest patch release of every dep from npm
  await findLatestVersions(deps)

  // now propose the most recent version of a dep for all projects
  for (const projectDir of projectDirs) {
    const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))

    selectVersions(pkg.dependencies ?? {}, deps, siblingVersions)
    selectVersions(pkg.devDependencies ?? {}, deps, siblingVersions)
    selectVersions(pkg.optionalDependencies ?? {}, deps, siblingVersions)
    selectVersions(pkg.peerDependencies ?? {}, deps, siblingVersions)

    await ensureFileHasContents(projectDir, 'package.json', JSON.stringify(pkg, null, 2))
  }
}

/**
 * @param {Record<string, string>} deps
 * @param {Record<string, string>} list
 */
function chooseVersions (deps, list) {
  for (const [dep, version] of Object.entries(deps)) {
    // not seen this dep before
    if (list[dep] == null) {
      list[dep] = version
      continue
    }

    // test for later version
    if (semver.gt(version.replace(/\^|~/, ''), list[dep].replace(/\^|~/, ''))) {
      list[dep] = version
    }
  }
}

/**
 * @param {Record<string, string>} deps
 */
async function findLatestVersions (deps) {
  // find the latest semver-compatible release from npm
  for (const [key, value] of Object.entries(deps)) {
    try {
      const npmVersion = `^${await latestVersion(key, { version: value })}`

      console.info(key, 'local version:', value, 'npm version:', npmVersion)

      deps[key] = npmVersion
    } catch (err) {
      console.error(`Could not load latest npm version of "${key}"`, err)
    }
  }
}

/**
 * @param {Record<string, string>} deps
 * @param {Record<string, string>} list
 * @param {Record<string, string>} siblingVersions
 */
async function selectVersions (deps, list, siblingVersions) {
  // release-please updates sibling versions to the latest patch releases but
  // we try to update to the latest minor so skip that if release please is
  // in use
  const ignoreSiblingDeps = usesReleasePlease()

  for (const [key, value] of Object.entries(list)) {
    if (deps[key] != null) {
      if (siblingVersions[key] != null && !ignoreSiblingDeps) {
        // take sibling version if available
        deps[key] = siblingVersions[key]
      } else {
        // otherwise take global dep version if available
        deps[key] = value
      }
    }
  }
}

/**
 * @param {string[]} projectDirs
 */
async function configureMonorepoProjectReferences (projectDirs) {
  console.info('Configure monorepo project references (typescript only)')

  /** @type {Record<string, string>} */
  const references = {}

  // first loop over every project and choose the most recent version of a given dep
  for (const projectDir of projectDirs) {
    const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))

    references[pkg.name] = projectDir
  }

  // now ensure the references are set up correctly
  // now propose the most recent version of a dep for all projects
  for (const projectDir of projectDirs) {
    if (!fs.existsSync(path.join(projectDir, 'tsconfig.json'))) {
      continue
    }

    const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))
    const tsconfig = fs.readJSONSync(path.join(projectDir, 'tsconfig.json'))
    const refs = new Set()

    addReferences(pkg.dependencies || {}, references, refs)
    addReferences(pkg.devDependencies || {}, references, refs)
    addReferences(pkg.optionalDependencies || {}, references, refs)
    addReferences(pkg.peerDependencies || {}, references, refs)

    tsconfig.references = Array.from(refs.values()).map(refDir => {
      return {
        path: path.relative(projectDir, refDir)
      }
    })

    tsconfig.references = tsconfig.references
      .sort((/** @type {{ path: string }} */ a, /** @type {{ path: string }} */ b) => a.path.localeCompare(b.path))
      .filter((/** @type {{ path: string }} */ ref) => ref.path.trim() !== '')

    if (tsconfig.references.length === 0) {
      delete tsconfig.references
    }

    await ensureFileHasContents(projectDir, 'tsconfig.json', JSON.stringify(tsconfig, null, 2))
  }
}

/**
 * @param {Record<string, string>} deps
 * @param {Record<string, string>} references
 * @param {Set<string>} refs
 */
function addReferences (deps, references, refs) {
  Object.keys(deps).forEach(key => {
    if (references[key] == null) {
      return
    }

    refs.add(references[key])
  })
}

/**
 * @param {string} projectDir
 * @param {any} manifest
 * @param {string} branchName
 * @param {string} repoUrl
 * @param {string} ciFile
 */
async function processProject (projectDir, manifest, branchName, repoUrl, ciFile) {
  const releaseType = 'semantic-release'

  await processModule({ projectDir, manifest, branchName, repoUrl, homePage: repoUrl, ciFile, releaseType })
  await checkBuildFiles(projectDir, branchName, repoUrl)
}

/**
 * @param {any} manifest
 */
function isAegirProject (manifest) {
  return Boolean(manifest.devDependencies && manifest.devDependencies.aegir) || Boolean(manifest.dependencies && manifest.dependencies.aegir)
}

/**
 * @typedef {object} ProcessModuleContext
 * @property {string} projectDir
 * @property {any} manifest
 * @property {string} branchName
 * @property {string} repoUrl
 * @property {string} homePage
 * @property {string} ciFile
 * @property {any} [rootManifest]
 * @property {"semantic-release" | "release-please"} releaseType
 */

/**
 * @typedef {object} ProcessManifestContext
 * @property {any} manifest
 * @property {string} branchName
 * @property {string} repoUrl
 * @property {string} homePage
 * @property {"semantic-release" | "release-please"} releaseType
 */

/**
 * @param {ProcessModuleContext} context
 */
async function processModule (context) {
  const { projectDir, manifest, branchName, repoUrl, homePage = repoUrl, ciFile, rootManifest, releaseType } = context

  if (!isAegirProject(manifest) && manifest.name !== 'aegir') {
    throw new Error(`"${projectDir}" is not an aegir project`)
  }

  const esm = manifest.type === 'module'
  const cjs = manifest.type !== 'module'
  const types = Boolean(manifest.types)
  const hasMain = Boolean(manifest.main)
  const hasIndexTs = fs.existsSync(path.join(projectDir, 'src/index.ts'))
  const hasIndexJs = fs.existsSync(path.join(projectDir, 'src/index.js'))

  // our project types:

  // 1. typescript - ESM, types, src/index.ts present
  let typescript = esm && types && hasIndexTs

  // 2. typedESM - ESM, types, src/index.js present
  let typedESM = esm && types && hasIndexJs

  // 3. CJS, no types
  let typedCJS = cjs && hasMain && types

  // 4. ESM, no types
  let untypedESM = esm && hasMain

  // 5. CJS, no types
  let untypedCJS = cjs && hasMain

  /** @type any */
  let proposedManifest = {}

  if (!typescript && !typedESM && !typedCJS && !untypedCJS) {
    console.info('Cannot detect project type')
    const { projectType } = await prompt.get({
      properties: {
        projectType: {
          description: 'Project type: typescript | typedESM | typedCJS | untypedESM | untypedCJS | skip',
          required: true,
          conform: (value) => {
            return ['typescript', 'typedESM', 'typedCJS', 'untypedESM', 'untypedCJS', 'skip'].includes(value)
          },
          default: 'skip'
        }
      }
    })

    if (projectType === 'skip') {
      console.info('Skipping', manifest.name)
      return
    } else if (projectType === 'typescript') {
      typescript = true
    } else if (projectType === 'typedESM') {
      typedESM = true
    } else if (projectType === 'typedCJS') {
      typedCJS = true
    } else if (projectType === 'untypedESM') {
      untypedESM = true
    } else if (projectType === 'untypedCJS') {
      untypedCJS = true
    } else {
      throw new Error('Could not determine project type')
    }
  }

  if (typescript) {
    console.info('TypeScript project detected')
    proposedManifest = await typescriptManifest({ manifest, branchName, repoUrl, homePage, releaseType })
  } else if (typedESM) {
    console.info('Typed ESM project detected')
    proposedManifest = await typedESMManifest({ manifest, branchName, repoUrl, homePage, releaseType })
  } else if (typedCJS) {
    console.info('Typed CJS project detected')
    proposedManifest = await typedCJSManifest({ manifest, branchName, repoUrl, homePage, releaseType })
  } else if (untypedESM) {
    console.info('Untyped ESM project detected')
    proposedManifest = await untypedESMManifest({ manifest, branchName, repoUrl, homePage, releaseType })
  } else if (untypedCJS) {
    console.info('Untyped CJS project detected')
    proposedManifest = await untypedCJSManifest({ manifest, branchName, repoUrl, homePage, releaseType })
  } else {
    throw new Error('Cannot determine project type')
  }

  proposedManifest = sortManifest(proposedManifest)

  await ensureFileHasContents(projectDir, 'package.json', JSON.stringify(proposedManifest, null, 2))

  if (!isMonorepoProject(projectDir)) {
    await ensureFileHasContents(projectDir, '.gitignore', fs.readFileSync(path.join(__dirname, 'files', 'gitignore'), {
      encoding: 'utf-8'
    }))
  }

  await checkLicenseFiles(projectDir)
  await checkReadme(projectDir, repoUrl, homePage, branchName, ciFile, rootManifest)
  await checkTypedocFiles(projectDir, typescript)
}

export default new Listr([
  {
    title: 'check project',
    task: async () => {
      const argv = yargsParser(process.argv.slice(2))._ // argv = ['check-project', ...]
      const projectDir = argv[1]?.toString() ?? process.cwd()
      const { branchName, repoUrl } = await getConfig(projectDir)
      const manifest = fs.readJSONSync(path.join(projectDir, 'package.json'))
      const monorepo = manifest.workspaces != null
      const defaultCiFile = fs.existsSync(path.resolve(process.cwd(), '.github', 'workflows', 'main.yml')) ? 'main.yml' : 'js-test-and-release.yml'

      const ciFile = (await prompt.get({
        properties: {
          ciFile: {
            description: 'ciFile',
            required: true,
            default: defaultCiFile
          }
        }
      })).ciFile.toString()

      if (monorepo) {
        console.info('monorepo project detected')
        await processMonorepo(projectDir, manifest, branchName, repoUrl, ciFile)
      } else {
        await processProject(projectDir, manifest, branchName, repoUrl, ciFile)
      }
    }
  }
], { renderer: 'verbose' })
