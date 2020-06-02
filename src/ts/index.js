'use strict'

const path = require('path')
const execa = require('execa')
const fs = require('fs-extra')
const rimraf = require('rimraf')
const merge = require('merge-options')
const { fromRoot, fromAegir, repoDirectory, hasFile } = require('../utils')
let baseTsConfig = require('./../config/aegir-tsconfig.json')

if (hasFile('tsconfig.json')) {
  baseTsConfig = require(fromRoot('tsconfig.json'))
}

module.exports = (argv) => {
  const forwardOptions = argv['--'] ? argv['--'] : []

  if (argv.preset === 'check') {
    return check(forwardOptions)
  }

  if (argv.preset === 'types') {
    return types(forwardOptions)
  }

  if (argv.preset === 'types-clean') {
    return typesClean()
  }

  if (argv.preset === 'docs') {
    return docs(forwardOptions)
  }

  if (!argv.preset) {
    return execa('tsc', [
      ...forwardOptions
    ], {
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })
  }
}

const check = async (forwardOptions) => {
  const configPath = fromRoot('tsconfig-check.json')
  try {
    fs.writeJsonSync(
      configPath,
      merge(baseTsConfig, {
        include: ['src/**/*', 'test/**/*']
      })
    )
    await execa('tsc', [
      '-p', configPath,
      ...forwardOptions
    ], {
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })
  } finally {
    fs.removeSync(configPath)
  }
}

const typesClean = () => {
  rimraf.sync(path.join(repoDirectory, 'src/**/*.d.ts'))
}

const types = async (forwardOptions) => {
  const configPath = fromRoot('tsconfig-types.json')
  typesClean()
  try {
    fs.writeJsonSync(
      configPath,
      merge(baseTsConfig, {
        compilerOptions: {
          noEmit: false,
          emitDeclarationOnly: true
          // outDir: 'types'
        },
        include: [
          'src/**/*'
        ]
      })
    )
    await execa('tsc', [
      '-p', configPath,
      ...forwardOptions
    ], {
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })
  } finally {
    fs.removeSync(configPath)
  }
}

const docs = async (forwardOptions) => {
  const configPath = fromRoot('tsconfig-docs.json')
  try {
    fs.writeJsonSync(
      configPath,
      merge(baseTsConfig, {
        compilerOptions: {
          noEmit: false,
          emitDeclarationOnly: true,
          outDir: 'types'
        },
        include: ['src/**/*']
      })
    )

    // run tsc
    await execa('tsc', [
      '-p', configPath,
      ...forwardOptions
    ], {
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })

    // run typedoc
    await execa('typedoc', [
      '--inputfiles', fromRoot('types'),
      '--mode', 'modules',
      '--out', 'docs',
      '--excludeExternals',
      '--excludeNotDocumented',
      // '--excludeNotExported',
      '--excludePrivate',
      '--excludeProtected',
      '--includeDeclarations',
      '--hideGenerator',
      '--includeVersion',
      '--gitRevision', 'master',
      '--disableSources',
      '--tsconfig', configPath,
      '--plugin', fromAegir('src/ts/typedoc-plugin.js'),
      '--theme', fromAegir('./../../node_modules/aegir-typedoc-theme/bin/default')
    ], {
      localDir: path.join(__dirname, '..'),
      preferLocal: true,
      stdio: 'inherit'
    })
  } finally {
    fs.removeSync(configPath)
    fs.removeSync(fromRoot('types'))
  }
}
