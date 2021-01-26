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
 * @typedef {Object} Options
 * @property {"config" | "check" | "types" | "docs"} preset
 * @property {string[]} forwardOptions - Extra options to forward to the backend
 * @property {string[]} extraInclude - Extra include files for the TS Config
 */

/**
 * Typescript command
 *
 * @param {any} argv
 */
module.exports = async (argv) => {
  /** @type {Options} */
  const opts = {
    forwardOptions: argv['--'] ? argv['--'] : [],
    extraInclude: (argv.include && argv.include.length > 0) ? await globby(argv.include) : [],
    preset: argv.preset
  }

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
  const userTSConfig = readJson(fromRoot('tsconfig.json'))
  switch (argv.preset) {
    case 'check':
      return check(userTSConfig, opts)
    case 'types':
      return types(userTSConfig, opts)
    case 'docs':
      return docs(userTSConfig, opts)
    default:
      return execa('tsc', ['--build', ...opts.forwardOptions], {
        localDir: path.join(__dirname, '../..'),
        preferLocal: true,
        stdio: 'inherit'
      })
  }
}

/**
 * Check preset
 *
 * @param {any} userTSConfig
 * @param {Options} opts
 */
const check = async (userTSConfig, { extraInclude, forwardOptions }) => {
  const configPath = fromRoot('tsconfig-check.aegir.json')
  try {
    fs.writeJsonSync(
      configPath,
      merge.apply({ concatArrays: true }, [
        userTSConfig,
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
 * @param {any} userTSConfig
 * @param {Options} opts
 */
const types = async (userTSConfig, { extraInclude, forwardOptions }) => {
  const configPath = fromRoot('tsconfig-types.aegir.json')
  try {
    fs.writeJsonSync(
      configPath,
      merge.apply({ concatArrays: true }, [
        userTSConfig,
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
 * @param {any} userTSConfig
 * @param {Options} opts
 */
const docs = async (userTSConfig, opts) => {
  // run typedoc
  await execa(
    'typedoc',
    [
      fromRoot('src/index.js'),
      '--out', 'docs',
      '--hideGenerator',
      '--includeVersion',
      '--gitRevision', 'master',
      '--plugin', fromAegir('src/ts/typedoc-plugin.js')
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
