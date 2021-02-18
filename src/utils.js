/* eslint-disable no-console */
/**
 * Various utility methods used in AEgir.
 *
 * @module aegir/utils
 */
'use strict'
const { constants, createBrotliCompress, createGzip } = require('zlib')
const os = require('os')
const ora = require('ora')
const extract = require('extract-zip')
const stripComments = require('strip-json-comments')
const stripBom = require('strip-bom')
const { download } = require('@electron/get')
const path = require('path')
const readline = require('readline')
const readPkgUp = require('read-pkg-up')
const fs = require('fs-extra')
const execa = require('execa')
const envPaths = require('env-paths')('aegir', { suffix: '' })
const lockfile = require('proper-lockfile')
const {
  // @ts-ignore
  packageJson: pkg,
  // @ts-ignore
  path: pkgPath
} = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
})
const DIST_FOLDER = 'dist'
const SRC_FOLDER = 'src'
const TEST_FOLDER = 'test'

exports.pkg = pkg
exports.repoDirectory = path.dirname(pkgPath)
/**
 * @param {string[]} p
 */
exports.fromRoot = (...p) => path.join(exports.repoDirectory, ...p)
/**
 * @param {string[]} p
 */
exports.hasFile = (...p) => fs.existsSync(exports.fromRoot(...p))
/**
 * @param {string[]} p
 */
exports.fromAegir = (...p) => path.join(__dirname, '..', ...p)
exports.hasTsconfig = exports.hasFile('tsconfig.json')

exports.paths = {
  dist: this.fromRoot(DIST_FOLDER),
  src: this.fromRoot(SRC_FOLDER),
  test: this.fromRoot(TEST_FOLDER),
  package: pkgPath
}

/**
 * Parse json with comments or empty
 *
 * @param {string} contents
 */
exports.parseJson = (contents) => {
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
exports.readJson = (filePath) => {
  return exports.parseJson(fs.readFileSync(filePath, { encoding: 'utf-8' }))
}

/**
 * Get the config for Listr.
 *
 * @returns {{renderer: 'verbose'}} - config for Listr
 */
exports.getListrConfig = () => {
  return {
    renderer: 'verbose'
  }
}

/**
 * @param {string} command
 * @param {string[] | undefined} args
 * @param {any} options
 */
exports.exec = (command, args, options = {}) => {
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

exports.getElectron = async () => {
  // @ts-ignore
  const pkg = require('./../package.json')

  const lockfilePath = path.join(envPaths.cache, '__electron-lock')
  fs.mkdirpSync(envPaths.cache)
  const releaseLock = await lockfile.lock(envPaths.cache, {
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
exports.brotliSize = (path) => {
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
exports.gzipSize = (path) => {
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

exports.otp = () => {
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
