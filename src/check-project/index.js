/* eslint-disable no-console,complexity */

import fs from 'fs'
import path from 'path'
import { execa } from 'execa'
import prompt from 'prompt'
import glob from 'it-glob'
import { monorepoManifest } from './manifests/monorepo.js'
import { typedESMManifest } from './manifests/typed-esm.js'
import { typescriptManifest } from './manifests/typescript.js'
import { untypedCJSManifest } from './manifests/untyped-cjs.js'
import { typedCJSManifest } from './manifests/typed-cjs.js'
import { checkLicenseFiles } from './check-licence-files.js'
import { checkBuildFiles } from './check-build-files.js'
import { checkMonorepoFiles } from './check-monorepo-files.js'
import { checkReadme } from './check-readme.js'
import { checkMonorepoReadme } from './check-monorepo-readme.js'
import {
  sortManifest,
  ensureFileHasContents
} from './utils.js'
import semver from 'semver'
import Listr from 'listr'

/**
 * @param {string} projectDir
 */
async function getConfig (projectDir) {
  if (process.env.CI) {
    const branchName = await execa('git', ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], {
      cwd: projectDir
    })
      .then(res => execa('basename', [res.stdout]))
      .then(res => res.stdout)
      .catch(() => {
        return 'master'
      })
    const repoUrl = await execa('git', ['remote', 'get-url', 'origin'], {
      cwd: projectDir
    })
      .then(res => res.stdout.split(':')[1].split('.git')[0])
      .then(res => `https://github.com/${res}`)
      .catch(() => {
        return ''
      })

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
        default: await execa('git', ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], {
          cwd: projectDir
        })
          .then(res => execa('basename', [res.stdout]))
          .then(res => res.stdout)
          .catch(() => {
            return 'master'
          })
      },
      repoUrl: {
        default: await execa('git', ['remote', 'get-url', 'origin'], {
          cwd: projectDir
        })
          .then(res => res.stdout.split(':')[1].split('.git')[0])
          .then(res => `https://github.com/${res}`)
          .catch(() => {
            return ''
          })
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
 */
async function processMonorepo (projectDir, manifest, branchName, repoUrl) {
  const workspaces = manifest.workspaces

  if (!workspaces || !Array.isArray(workspaces)) {
    throw new Error('No monorepo workspaces found')
  }

  const projectDirs = []

  for (const workspace of workspaces) {
    for await (const subProjectDir of glob('.', workspace, {
      cwd: projectDir,
      absolute: true
    })) {
      const pkg = JSON.parse(fs.readFileSync(path.join(subProjectDir, 'package.json'), {
        encoding: 'utf-8'
      }))

      const homePage = `${repoUrl}/tree/master${subProjectDir.substring(projectDir.length)}`

      console.info('Found monorepo project', pkg.name)

      await processModule(subProjectDir, pkg, branchName, repoUrl, homePage)

      projectDirs.push(subProjectDir)
    }
  }

  await alignMonorepoProjectDependencies(projectDirs)
  await configureMonorepoProjectReferences(projectDirs)

  let proposedManifest = await monorepoManifest(manifest, repoUrl)
  proposedManifest = sortManifest(proposedManifest)

  await ensureFileHasContents(projectDir, 'package.json', JSON.stringify(proposedManifest, null, 2))
  await checkLicenseFiles(projectDir)
  await checkBuildFiles(projectDir, branchName, repoUrl)
  await checkMonorepoReadme(projectDir, repoUrl, branchName, projectDirs)
  await checkMonorepoFiles(projectDir)
}

/**
 * @param {string[]} projectDirs
 */
async function alignMonorepoProjectDependencies (projectDirs) {
  console.info('Align monorepo project dependencies')

  /** @type {Record<string, string>} */
  const siblingVersions = {}
  /** @type {Record<string, string>} */
  const deps = {}
  /** @type {Record<string, string>} */
  const devDeps = {}
  /** @type {Record<string, string>} */
  const optionalDeps = {}
  /** @type {Record<string, string>} */
  const peerDeps = {}

  // first loop over every project and choose the most recent version of a given dep
  for (const projectDir of projectDirs) {
    const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
      encoding: 'utf-8'
    }))

    // turn 1.4.1 -> 1.4.0, otherwise every patch release causes all the sibling deps to change
    siblingVersions[pkg.name] = `^${pkg.version.split('.').slice(0, 2).join('.')}.0`

    chooseVersions(pkg.dependencies || {}, deps)
    chooseVersions(pkg.devDependencies || {}, devDeps)
    chooseVersions(pkg.optionalDeps || {}, optionalDeps)
    chooseVersions(pkg.peerDeps || {}, peerDeps)
  }

  // now propose the most recent version of a dep for all projects
  for (const projectDir of projectDirs) {
    const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
      encoding: 'utf-8'
    }))

    selectVersions(pkg.dependencies || {}, deps, siblingVersions)
    selectVersions(pkg.devDependencies || {}, devDeps, siblingVersions)
    selectVersions(pkg.optionalDeps || {}, optionalDeps, siblingVersions)
    selectVersions(pkg.peerDeps || {}, peerDeps, siblingVersions)

    await ensureFileHasContents(projectDir, 'package.json', JSON.stringify(pkg, null, 2))
  }
}

/**
 * @param {Record<string, string>} deps
 * @param {Record<string, string>} list
 */
function chooseVersions (deps, list) {
  Object.entries(deps).forEach(([key, value]) => {
    // not seen this dep before
    if (!list[key]) {
      list[key] = value
      return
    }

    const existingVersion = semver.minVersion(list[key])
    const moduleVersion = semver.minVersion(value)

    // take the most recent range or version
    const res = semver.compare(existingVersion ?? '0.0.0', moduleVersion ?? '0.0.0')

    if (res === -1) {
      list[key] = value
    }
  })
}

/**
 * @param {Record<string, string>} deps
 * @param {Record<string, string>} list
 * @param {Record<string, string>} siblingVersions
 */
function selectVersions (deps, list, siblingVersions) {
  Object.entries(list).forEach(([key, value]) => {
    if (deps[key] != null) {
      if (siblingVersions[key] != null) {
        // take sibling version if available
        deps[key] = siblingVersions[key]
      } else {
        // otherwise take global dep version if available
        deps[key] = value
      }
    }
  })
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
    const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
      encoding: 'utf-8'
    }))

    references[pkg.name] = projectDir
  }

  // now ensure the references are set up correctly
  // now propose the most recent version of a dep for all projects
  for (const projectDir of projectDirs) {
    if (!fs.existsSync(path.join(projectDir, 'tsconfig.json'))) {
      continue
    }

    const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
      encoding: 'utf-8'
    }))

    const tsconfig = JSON.parse(fs.readFileSync(path.join(projectDir, 'tsconfig.json'), {
      encoding: 'utf-8'
    }))

    const refs = new Set()

    addReferences(pkg.dependencies || {}, references, refs)
    addReferences(pkg.devDependencies || {}, references, refs)
    addReferences(pkg.optionalDeps || {}, references, refs)
    addReferences(pkg.peerDeps || {}, references, refs)

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
 */
async function processProject (projectDir, manifest, branchName, repoUrl) {
  await processModule(projectDir, manifest, branchName, repoUrl)
  await checkBuildFiles(projectDir, branchName, repoUrl)
}

/**
 * @param {any} manifest
 */
function isAegirProject (manifest) {
  return Boolean(manifest.devDependencies && manifest.devDependencies.aegir) || Boolean(manifest.dependencies && manifest.dependencies.aegir)
}

/**
 *
 * @param {string} projectDir
 * @param {any} manifest
 * @param {string} branchName
 * @param {string} repoUrl
 * @param {string} homePage
 */
async function processModule (projectDir, manifest, branchName, repoUrl, homePage = repoUrl) {
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

  // 3. CJS, no types
  let untypedCJS = cjs && hasMain

  let proposedManifest = {}

  if (!typescript && !typedESM && !typedCJS && !untypedCJS) {
    console.info('Cannot detect project type')
    const { projectType } = await prompt.get({
      properties: {
        projectType: {
          description: 'Project type: typescript | typedESM | typedCJS | untypedCJS',
          required: true,
          conform: (value) => {
            return ['typescript', 'typedESM', 'typedCJS', 'untypedCJS'].includes(value)
          },
          default: 'typescript'
        }
      }
    })

    if (projectType === 'typescript') {
      typescript = true
    } else if (projectType === 'typedESM') {
      typedESM = true
    } else if (projectType === 'typedCJS') {
      typedCJS = true
    } else if (projectType === 'untypedCJS') {
      untypedCJS = true
    } else {
      throw new Error('Could not determine project type')
    }
  }

  if (typescript) {
    console.info('TypeScript project detected')
    proposedManifest = await typescriptManifest(manifest, branchName, repoUrl, homePage)
  } else if (typedESM) {
    console.info('Typed ESM project detected')
    proposedManifest = await typedESMManifest(manifest, branchName, repoUrl, homePage)
  } else if (typedCJS) {
    console.info('Typed CJS project detected')
    proposedManifest = await typedCJSManifest(manifest, branchName, repoUrl, homePage)
  } else if (untypedCJS) {
    console.info('Untyped CJS project detected')
    proposedManifest = await untypedCJSManifest(manifest, branchName, repoUrl, homePage)
  } else {
    throw new Error('Cannot determine project type')
  }

  proposedManifest = sortManifest(proposedManifest)

  await ensureFileHasContents(projectDir, 'package.json', JSON.stringify(proposedManifest, null, 2))
  await checkLicenseFiles(projectDir)
  await checkReadme(projectDir, repoUrl, branchName)
}

export default new Listr([
  {
    title: 'check project',
    task: async () => {
      const projectDir = process.argv[3] || process.cwd()
      const { branchName, repoUrl } = await getConfig(projectDir)

      const manifest = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
        encoding: 'utf-8'
      }))

      const monorepo = manifest.workspaces != null

      if (monorepo) {
        console.info('monorepo project detected')
        await processMonorepo(projectDir, manifest, branchName, repoUrl)
      } else {
        await processProject(projectDir, manifest, branchName, repoUrl)
      }
    }
  }
], { renderer: 'verbose' })
