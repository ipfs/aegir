'use strict'

const {
  exec
} = require('../utils')
const glob = require('it-glob')
const all = require('it-all')
const promisify = require('util').promisify
const rimraf = promisify(require('rimraf'))

async function generateTypes (argv) {
  const files = (await Promise.all(
    argv.input.map(pattern => all(glob(process.cwd(), pattern, {
      absolute: true,
      nodir: true
    })))
  )).reduce((acc, curr) => acc.concat(curr), [])

  if (!files.length) {
    throw new Error(`Invalid input glob pattern ${argv.input.join()}`)
  }

  if (argv.overwrite) {
    // remove any .td.ts definitions that already exist for the input files
    for (const path of files) {
      if (!path.endsWith('.js')) {
        continue
      }

      // foo.js -> foo.d.ts
      const tsDef = path.substring(0, path.length - 3) + '.d.ts'

      // will not error if the file does not exist
      await rimraf(tsDef)
    }
  }

  const forwardOptions = argv['--'] ? argv['--'] : []
  const args = ['-d', '--emitDeclarationOnly'].concat(forwardOptions).concat(files)

  const cmd = exec(require.resolve('typescript/bin/tsc'), args, {
    cwd: process.cwd()
  })

  cmd.stdout.on('data', data => {
    console.info(data.toString()) // eslint-disable-line no-console
  })
  cmd.stderr.on('data', data => {
    console.error(data.toString()) // eslint-disable-line no-console
  })

  await cmd
}

module.exports = generateTypes
