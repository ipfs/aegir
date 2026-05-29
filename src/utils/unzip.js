import path from 'node:path'
import stream from 'node:stream'
import { text } from 'node:stream/consumers'
import { promisify } from 'node:util'
import fs from 'fs-extra'
import yauzl from 'yauzl'

/** @type {(path: string, options: yauzl.Options) => Promise<yauzl.ZipFile>} */
const openZip = promisify(yauzl.open)
const pipeline = promisify(stream.pipeline)

/**
 * @typedef UnzipOpts
 * @property {string} dir The directory to extract to
 * @property {number | string} [defaultDirMode] Override the default dir mode
 * @property {number | string} [defaultFileMode] Override the default file mode
 * @property {(entry: yauzl.Entry, zip: yauzl.ZipFile) => void} [onEntry] Callback to handle directory entries
 */

class Extractor {
  /**
   * @param {string} zipPath
   * @param {UnzipOpts} opts
   */
  constructor (zipPath, opts) {
    this.zipPath = zipPath
    this.opts = opts
  }

  /**
   * @returns {Promise<void>}
   */
  async extract () {
    const zipfile = await openZip(this.zipPath, {
      lazyEntries: true
    })
    this.canceled = false

    return new Promise((resolve, reject) => {
      zipfile.on('error', err => {
        this.canceled = true
        reject(err)
      })
      zipfile.readEntry()

      zipfile.on('close', () => {
        if (!this.canceled) {
          resolve()
        }
      })

      zipfile.on('entry', async entry => {
        /* istanbul ignore if */
        if (this.canceled) {
          return
        }

        if (entry.fileName.startsWith('__MACOSX/')) {
          zipfile.readEntry()
          return
        }

        const destDir = path.dirname(path.join(this.opts.dir, entry.fileName))

        try {
          await fs.mkdir(destDir, { recursive: true })

          const canonicalDestDir = await fs.realpath(destDir)
          const relativeDestDir = path.relative(this.opts.dir, canonicalDestDir)

          if (relativeDestDir.split(path.sep).includes('..')) {
            throw new Error(`Out of bound path "${canonicalDestDir}" found while processing file ${entry.fileName}`)
          }

          await this.extractEntry(entry, zipfile)
          zipfile.readEntry()
        } catch (err) {
          this.canceled = true
          zipfile.close()
          reject(err)
        }
      })
    })
  }

  /**
   * @param {yauzl.Entry} entry
   * @param {yauzl.ZipFile} zipfile
   */
  async extractEntry (entry, zipfile) {
    /* istanbul ignore if */
    if (this.canceled) {
      return
    }

    if (this.opts.onEntry) {
      this.opts.onEntry(entry, zipfile)
    }

    const dest = path.join(this.opts.dir, entry.fileName)

    // convert external file attr int into a fs stat mode int
    const mode = (entry.externalFileAttributes >> 16) & 0xFFFF
    // check if it's a symlink or dir (using stat mode constants)
    // spell-checker: disable-next-line
    const IFMT = 61440
    // spell-checker: disable-next-line
    const IFDIR = 16384
    // spell-checker: disable-next-line
    const IFLNK = 40960
    // spell-checker: disable-next-line
    const symlink = (mode & IFMT) === IFLNK
    // spell-checker: disable-next-line
    let isDir = (mode & IFMT) === IFDIR

    // Failsafe, borrowed from jsZip
    if (!isDir && entry.fileName.endsWith('/')) {
      isDir = true
    }

    // check for windows weird way of specifying a directory
    // https://github.com/maxogden/extract-zip/issues/13#issuecomment-154494566
    const madeBy = entry.versionMadeBy >> 8
    if (!isDir) { isDir = (madeBy === 0 && entry.externalFileAttributes === 16) }

    const procMode = this.getExtractedMode(mode, isDir) & 0o777

    // always ensure folders are created
    const destDir = isDir ? dest : path.dirname(dest)

    /** @type {fs.MakeDirectoryOptions} */
    const mkdirOptions = { recursive: true }
    if (isDir) {
      mkdirOptions.mode = procMode
    }
    await fs.mkdir(destDir, mkdirOptions)
    if (isDir) { return }

    const readStream = await promisify(zipfile.openReadStream.bind(zipfile))(entry)

    if (symlink) {
      const link = await text(readStream)
      await fs.symlink(link, dest)
    } else {
      await pipeline(readStream, fs.createWriteStream(dest, { mode: procMode }))
    }
  }

  /**
   * @param {number} entryMode
   * @param {boolean} isDir
   * @returns {number}
   */
  getExtractedMode (entryMode, isDir) {
    let mode = entryMode
    // Set defaults, if necessary
    if (mode === 0) {
      if (isDir) {
        if (this.opts.defaultDirMode != null) {
          mode = parseInt(`${this.opts.defaultDirMode}`, 10)
        }

        if (!mode) {
          mode = 0o755
        }
      } else {
        if (this.opts.defaultFileMode != null) {
          mode = parseInt(`${this.opts.defaultFileMode}`, 10)
        }

        if (!mode) {
          mode = 0o644
        }
      }
    }

    return mode
  }
}

/**
 *
 * @param {string} zipPath
 * @param {UnzipOpts} opts
 * @returns
 */
export async function unzip (zipPath, opts) {
  if (!path.isAbsolute(opts.dir)) {
    throw new Error('Target directory is expected to be absolute')
  }

  await fs.mkdir(opts.dir, {
    recursive: true
  })

  opts.dir = await fs.realpath(opts.dir)

  return new Extractor(zipPath, opts).extract()
}
