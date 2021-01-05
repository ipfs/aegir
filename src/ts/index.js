'use strict'

const path = require('path')
const execa = require('execa')
const fs = require('fs-extra')
const globby = require('globby')
const merge = require('merge-options')
const { fromRoot, fromAegir, hasFile, readJson } = require('../utils')
const hasConfig = hasFile('tsconfig.json')
/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 */

/**
 * Typescript command
 *
 * @param {any} argv
 */
module.exports = async (argv) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  const extraInclude = (argv.include && argv.include.length > 0) ? await globby(argv.include) : []

  if (argv.preset === 'config') {
    const extendsConfig = `{
    "extends": "aegir/src/config/tsconfig.aegir.json",
    "compilerOptions": {
        "outDir": "dist",
        "baseUrl": "./",
        "paths": {
          "*": ["./types/*"]
        }
    },
    "include": [
      "types",
      "test", // remove this line if you don't want to type-check tests
      "src"
    ]
}`
    // eslint-disable-next-line no-console
    console.log(extendsConfig)

    return
  }

  if (!hasConfig) {
    throw new Error(
      'TS config not found. Try running `aegir ts --preset config > tsconfig.json`'
    )
  }
  const userConfig = readJson(fromRoot('tsconfig.json'))
  switch (argv.preset) {
    case 'check':
      return check(userConfig, forwardOptions, extraInclude)
    case 'types':
      return types(userConfig, forwardOptions, extraInclude)
    case 'docs':
      return docs(userConfig, forwardOptions, extraInclude)
    default:
      return execa('tsc', ['--build', ...forwardOptions], {
        localDir: path.join(__dirname, '../..'),
        preferLocal: true,
        stdio: 'inherit'
      })
  }
}

/**
 * Check preset
 *
 * @param {any} userConfig
 * @param {any} forwardOptions
 * @param {string[]} extraInclude
 */
const check = async (userConfig, forwardOptions, extraInclude) => {
  const configPath = fromRoot('tsconfig-check.aegir.json')
  try {
    fs.writeJsonSync(
      configPath,
      merge.apply({ concatArrays: true }, [
        userConfig,
        {
          compilerOptions: {
            noEmit: true,
            emitDeclarationOnly: false
          },
          include: extraInclude
        }
      ])
    )
    await execa('tsc', ['--build', configPath, ...forwardOptions], {
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })
  } finally {
    fs.removeSync(configPath)
  }
}

/**
 * Types preset
 *
 * @param {any} userConfig
 * @param {any} forwardOptions
 * @param {string[]} extraInclude
 */
const types = async (userConfig, forwardOptions, extraInclude) => {
  const configPath = fromRoot('tsconfig-types.aegir.json')
  try {
    fs.writeJsonSync(
      configPath,
      merge.apply({ concatArrays: true }, [
        userConfig,
        {
          compilerOptions: {
            noEmit: false,
            emitDeclarationOnly: true
          },
          include: extraInclude,
          exclude: ['test']
        }
      ])
    )
    await execa('tsc', ['--build', configPath, ...forwardOptions], {
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })

    const typesPath = fromRoot('types')
    if (fs.existsSync(typesPath)) {
      fs.copySync(typesPath, fromRoot('dist', path.basename(typesPath)))
    }
  } finally {
    fs.removeSync(configPath)
    fs.removeSync(fromRoot('dist', 'tsconfig-types.aegir.tsbuildinfo'))
  }
}

/**
 * Docs preset
 *
 * @param {any} userConfig
 * @param {any} forwardOptions
 * @param {string[]} extraInclude
 */
const docs = async (userConfig, forwardOptions, extraInclude) => {
  await types(userConfig, forwardOptions, extraInclude)

  // run typedoc
  await execa(
    'typedoc',
    [
      '--inputfiles',
      fromRoot('dist'),
      '--mode',
      'modules',
      '--out',
      'docs',
      '--excludeExternals',
      // '--excludeNotDocumented',
      // '--excludeNotExported',
      // '--excludePrivate',
      // '--excludeProtected',
      '--includeDeclarations',
      '--hideGenerator',
      '--includeVersion',
      '--gitRevision',
      'master',
      '--disableSources',
      '--plugin',
      fromAegir('src/ts/typedoc-plugin.js'),
      '--theme',
      fromAegir(
        './../../node_modules/aegir-typedoc-theme/bin/default'
      )
    ],
    {
      localDir: path.join(__dirname, '..'),
      preferLocal: true,
      stdio: 'inherit'
    }
  )

  // write .nojekyll file
  fs.writeFileSync('docs/.nojekyll', '')
}
