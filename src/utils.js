/* eslint-disable no-console */
/**
 * Various utility methods used in AEgir.
 *
 * @module aegir/utils
 */

import { constants, createBrotliCompress, createGzip } from 'zlib'
import os from 'os'
import extract from 'extract-zip'
import stripComments from 'strip-json-comments'
import stripBom from 'strip-bom'
import { download } from '@electron/get'
import path from 'path'
import readline from 'readline'
import { readPackageUpSync } from 'read-pkg-up'
import fs from 'fs-extra'
import { execa } from 'execa'
import envPaths from 'env-paths'
import lockfile from 'proper-lockfile'
import { fileURLToPath } from 'url'
import Listr from 'listr'
import { minimatch } from 'minimatch'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EnvPaths = envPaths('aegir', { suffix: '' })

const {
  // @ts-ignore
  packageJson: pkg,
  // @ts-ignore
  path: pkgPath
} = readPackageUpSync({
  cwd: fs.realpathSync(process.cwd())
})
const DIST_FOLDER = 'dist'
const SRC_FOLDER = 'src'
const TEST_FOLDER = 'test'

export { pkg }
export const repoDirectory = path.dirname(pkgPath)
/**
 * @param {string[]} p
 */
export const fromRoot = (...p) => path.join(repoDirectory, ...p)
/**
 * @param {string[]} p
 */
export const hasFile = (...p) => fs.existsSync(fromRoot(...p))
/**
 * @param {string[]} p
 */
export const fromAegir = (...p) => path.join(__dirname, '..', ...p)
export const hasTsconfig = hasFile('tsconfig.json')

export const paths = {
  dist: fromRoot(DIST_FOLDER),
  src: fromRoot(SRC_FOLDER),
  test: fromRoot(TEST_FOLDER),
  package: pkgPath
}

/**
 * Parse json with comments or empty
 *
 * @param {string} contents
 */
export const parseJson = (contents) => {
  const data = stripComments(stripBom(contents))

  // A tsconfig.json file is permitted to be completely empty.
  if (/^\s*$/.test(data)) {
    return {}
  }

  return JSON.parse(data)
}

/**
 * Read JSON file
 *
 * @param {string | number | Buffer | import("url").URL} filePath
 */
export const readJson = (filePath) => {
  return parseJson(fs.readFileSync(filePath, { encoding: 'utf-8' }))
}

/**
 * Get the config for Listr.
 *
 * @returns {{renderer: 'verbose'}} - config for Listr
 */
export const getListrConfig = () => {
  return {
    renderer: 'verbose'
  }
}

/**
 * @param {string} command
 * @param {string[] | undefined} args
 * @param {any} options
 */
export const exec = (command, args, options = {}) => {
  const result = execa(command, args, options)

  if (!options.quiet) {
    // @ts-ignore
    result.stdout.pipe(process.stdout)
  }

  // @ts-ignore
  result.stderr.pipe(process.stderr)

  return result
}

function getPlatformPath () {
  const platform = process.env.npm_config_platform || os.platform()

  switch (platform) {
    case 'mas':
    case 'darwin':
      return 'Electron.app/Contents/MacOS/Electron'
    case 'freebsd':
    case 'openbsd':
    case 'linux':
      return 'electron'
    case 'win32':
      return 'electron.exe'
    default:
      throw new Error('Electron builds are not available on platform: ' + platform)
  }
}

export const getElectron = async () => {
  const pkg = await fs.readJSON('./package.json')

  const lockfilePath = path.join(EnvPaths.cache, '__electron-lock')
  fs.mkdirpSync(EnvPaths.cache)
  const releaseLock = await lockfile.lock(EnvPaths.cache, {
    retries: {
      retries: 10,
      // Retry 20 times during 10 minutes with
      // exponential back-off.
      // See documentation at: https://www.npmjs.com/package/retry#retrytimeoutsoptions
      factor: 1.27579
    },
    onCompromised: (err) => {
      throw new Error(`${err.message} Path: ${lockfilePath}`)
    },
    lockfilePath
  })

  const aegirManifest = await fs.readJSON(path.join(__dirname, '../package.json'))
  const version = pkg.devDependencies?.electron?.slice(1) ?? pkg.dependencies?.electron?.slice(1) ?? aegirManifest.devDependencies.electron.slice(1)
  let electronPath = ''
  let zipPath = ''

  const tasks = new Listr([{
    title: `Downloading electron: ${version}`,
    task: async () => {
      zipPath = await download(version)
      electronPath = path.join(path.dirname(zipPath), getPlatformPath())
    }
  }, {
    title: 'Extracting electron to system cache',
    enabled: () => !fs.existsSync(electronPath),
    task: async () => {
      await extract(zipPath, { dir: path.dirname(zipPath) })
    }
  }])

  try {
    await tasks.run()
  } finally {
    await releaseLock()
  }

  return electronPath
}

/**
 * @param {fs.PathLike} path
 */
export const brotliSize = (path) => {
  return new Promise((resolve, reject) => {
    let size = 0
    const pipe = fs.createReadStream(path).pipe(createBrotliCompress({
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11
      }
    }))
    pipe.on('error', reject)
    pipe.on('data', buf => {
      size += buf.length
    })
    pipe.on('end', () => {
      resolve(size)
    })
  })
}

/**
 * @param {fs.PathLike} path
 */
export const gzipSize = (path) => {
  return new Promise((resolve, reject) => {
    let size = 0
    const pipe = fs.createReadStream(path).pipe(createGzip({ level: 9 }))
    pipe.on('error', reject)
    pipe.on('data', buf => {
      size += buf.length
    })
    pipe.on('end', () => {
      resolve(size)
    })
  })
}

export const otp = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const otp = []
  return new Promise((resolve, reject) => {
    rl.question('OTP: ', answer => {
      resolve(answer)
      console.log('\n')
      rl.close()
    })
    // @ts-ignore
    rl._writeToOutput = function _writeToOutput (k) {
      otp.push(k)
      if (otp.length === 6) {
        // @ts-ignore
        rl.write(null, { name: 'enter' })
      } else {
        // @ts-ignore
        rl.output.write('*')
      }
    }
  })
}

export const isESM = pkg.type === 'module'
export const isCJS = pkg.type !== 'module'
export const hasTypes = Boolean(pkg.types)
export const hasMain = Boolean(pkg.main)
export const hasIndexTs = hasFile('src/index.ts')
export const hasIndexJs = hasFile('src/index.js')
export const isMonorepoParent = Boolean(pkg.workspaces)
export const hasDocs = Boolean(pkg.scripts?.docs)
export const hasDocCheck = Boolean(pkg.scripts && pkg.scripts['doc-check'])

// our project types:

// 1. typescript - ESM, types, src/index.ts present
export const isTypescript = isESM && hasTypes && hasIndexTs

// 2. typedESM - ESM, types, src/index.js present
export const isTypedESM = isESM && hasTypes && hasIndexJs

// 3. CJS, no types
export const isTypedCJS = isCJS && hasMain && hasTypes

// 3. CJS, no types
export const isUntypedCJS = isCJS && hasMain

export const isMonorepoProject = (dir = process.cwd()) => {
  const parentManifestPath = path.resolve(dir, '..', '..', 'package.json')

  return Boolean(fs.existsSync(parentManifestPath) && fs.readJSONSync(parentManifestPath).workspaces)
}

/**
 * Binaries we need are normally in `node_modules/.bin` of the root project
 * unless a sibling dependency has caused a different version to be hoisted
 * so check our local node_modules folder first, then fall back to the main
 * project node_modules folder, then fall back to the environment or fail.
 *
 * Happens quite often when old versions of typescript are in the dependency
 * tree.
 *
 * @param {string} bin
 * @returns {string}
 */
export function findBinary (bin) {
  // if bin is in local node_modules folder
  const aegirBin = fromAegir('node_modules', '.bin', bin)

  if (fs.existsSync(aegirBin)) {
    return aegirBin
  }

  // if bin has been hoisted
  const projectBin = fromRoot('node_modules', '.bin', bin)

  if (fs.existsSync(projectBin)) {
    return projectBin
  }

  // let shell work it out or error
  return bin
}

/**
 * @typedef {object} Project
 * @property {any} manifest
 * @property {string} dir
 * @property {string[]} siblingDependencies
 * @property {string[]} dependencies
 * @property {boolean} run
 */

/**
 * @param {string} projectDir
 * @param {(project: Project) => Promise<void>} fn
 */
export async function everyMonorepoProject (projectDir, fn) {
  const manifest = fs.readJSONSync(path.join(projectDir, 'package.json'))
  const workspaces = manifest.workspaces

  if (!workspaces || !Array.isArray(workspaces)) {
    throw new Error('No monorepo workspaces found')
  }

  /** @type {Record<string, Project>} */
  const projects = await parseProjects(projectDir, workspaces)

  checkForCircularDependencies(projects)

  /**
   * @param {Project} project
   */
  async function run (project) {
    if (project.run) {
      return
    }

    for (const siblingDep of project.siblingDependencies) {
      await run(projects[siblingDep])
    }

    if (project.run) {
      return
    }

    project.run = true
    await fn(project)
  }

  for (const project of Object.values(projects)) {
    await run(project)
  }
}

/**
 *
 * @param {string} projectDir
 * @param {string[]} workspaces
 */
async function parseProjects (projectDir, workspaces) {
  /** @type {Record<string, Project>} */
  const projects = {}

  for (const workspace of workspaces) {
    for await (const subProjectDir of glob('.', workspace, {
      cwd: projectDir,
      absolute: true
    })) {
      const pkg = fs.readJSONSync(path.join(subProjectDir, 'package.json'))

      projects[pkg.name] = {
        manifest: pkg,
        dir: subProjectDir,
        siblingDependencies: [],
        run: false,
        dependencies: [
          ...Object.keys(pkg.dependencies ?? {}),
          ...Object.keys(pkg.devDependencies ?? {}),
          ...Object.keys(pkg.optionalDependencies ?? {}),
          ...Object.keys(pkg.peerDependencies ?? {})
        ]
      }
    }
  }

  for (const project of Object.values(projects)) {
    for (const dep of project.dependencies) {
      if (projects[dep] != null) {
        project.siblingDependencies.push(dep)
      }
    }
  }

  return projects
}

/**
 * @param {Record<string, Project>} projects
 */
function checkForCircularDependencies (projects) {
  /**
   * @param {Project} project
   * @param {string} target
   * @param {Set<string>} checked
   * @param {string[]} chain
   * @returns {string[] | undefined}
   */
  function dependsOn (project, target, checked, chain) {
    chain = [...chain, project.manifest.name]

    if (project.manifest.name === target) {
      return chain
    }

    for (const dep of project.siblingDependencies) {
      if (checked.has(dep)) {
        // already checked this dep
        return
      }

      checked.add(dep)

      if (dep === target) {
        // circular dependency detected
        chain.push(target)
        return chain
      }

      const subChain = dependsOn(projects[dep], target, checked, chain)

      if (subChain != null) {
        return subChain
      }
    }
  }

  // check for circular dependencies
  for (const project of Object.values(projects)) {
    for (const siblingDep of project.siblingDependencies) {
      const sibling = projects[siblingDep]

      const chain = dependsOn(sibling, project.manifest.name, new Set([sibling.manifest.name]), [project.manifest.name])

      if (chain != null) {
        throw new Error(`Circular dependency detected: ${chain.join(' -> ')}`)
      }
    }
  }
}

/**
 * @typedef {object} GlobOptions
 * @property {string} [cwd] The current working directory
 * @property {boolean} [absolute] If true produces absolute paths (default: false)
 * @property {boolean} [nodir] If true yields file paths and skip directories (default: false)
 *
 * Async iterable filename pattern matcher
 *
 * @param {string} dir
 * @param {string} pattern
 * @param {GlobOptions & import('minimatch').MinimatchOptions} [options]
 * @returns {AsyncGenerator<string, void, undefined>}
 */
export async function * glob (dir, pattern, options = {}) {
  const absoluteDir = path.resolve(dir)
  const relativeDir = path.relative(options.cwd ?? process.cwd(), dir)

  const stats = await fs.stat(absoluteDir)

  if (stats.isDirectory()) {
    for await (const entry of _glob(absoluteDir, '', pattern, options)) {
      yield entry
    }

    return
  }

  if (minimatch(relativeDir, pattern, options)) {
    yield options.absolute === true ? absoluteDir : relativeDir
  }
}

/**
 * @param {string} base
 * @param {string} dir
 * @param {string} pattern
 * @param {GlobOptions & import('minimatch').IOptions} options
 * @returns {AsyncGenerator<string, void, undefined>}
 */
async function * _glob (base, dir, pattern, options) {
  for await (const entry of await fs.opendir(path.join(base, dir))) {
    const relativeEntryPath = path.join(dir, entry.name)
    const absoluteEntryPath = path.join(base, dir, entry.name)

    let match = minimatch(relativeEntryPath, pattern, options)

    const isDirectory = entry.isDirectory()

    if (isDirectory && options.nodir === true) {
      match = false
    }

    if (match) {
      yield options.absolute === true ? absoluteEntryPath : relativeEntryPath
    }

    if (isDirectory) {
      yield * _glob(base, relativeEntryPath, pattern, options)
    }
  }
}
