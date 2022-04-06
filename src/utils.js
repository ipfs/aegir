/* eslint-disable no-console */
/**
 * Various utility methods used in AEgir.
 *
 * @module aegir/utils
 */

import { constants, createBrotliCompress, createGzip } from 'zlib'
import os from 'os'
import ora from 'ora'
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
  // @ts-ignore
  const pkg = require('./../package.json')

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

  const version = pkg.devDependencies.electron.slice(1)
  const spinner = ora(`Downloading electron: ${version}`).start()
  const zipPath = await download(version)
  const electronPath = path.join(path.dirname(zipPath), getPlatformPath())
  if (!fs.existsSync(electronPath)) {
    spinner.text = 'Extracting electron to system cache'
    await extract(zipPath, { dir: path.dirname(zipPath) })
  }
  spinner.stop()
  await releaseLock()
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
