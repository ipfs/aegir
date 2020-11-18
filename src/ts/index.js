'use strict'

const path = require('path')
const execa = require('execa')
const fs = require('fs-extra')
const globby = require('globby')
const merge = require('merge-options')
const { fromRoot, fromAegir, hasFile, readJson } = require('../utils')
const hasConfig = hasFile('tsconfig.json')
let userConfig = null

module.exports = async (argv) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  const extraInclude = await globby(argv.include)

  if (argv.preset === 'config') {
    const extendsConfig = `{
    "extends": "./${path.relative(
        process.cwd(),
        require.resolve('aegir/src/config/tsconfig.aegir.json')
    )}",
    "compilerOptions": {
        "outDir": "dist"
    },
    "include": [
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
  userConfig = readJson(fromRoot('tsconfig.json'))

  if (argv.preset === 'check') {
    return check(forwardOptions, extraInclude)
  }

  if (argv.preset === 'types') {
    return types(forwardOptions, extraInclude)
  }

  if (argv.preset === 'docs') {
    return docs(forwardOptions, extraInclude)
  }

  if (!argv.preset) {
    return execa('tsc', ['--build', ...forwardOptions], {
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })
  }
}

const check = async (forwardOptions, extraInclude) => {
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

const types = async (forwardOptions, extraInclude) => {
  const configPath = fromRoot('tsconfig-types.aegir.json')
  try {
    fs.writeJsonSync(
      configPath,
      merge(userConfig, {
        compilerOptions: {
          noEmit: false,
          emitDeclarationOnly: true
        },
        include: ['src', 'package.json', ...extraInclude]
      })
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

const docs = async (forwardOptions, extraInclude) => {
  const configPath = fromRoot('tsconfig-docs.aegir.json')
  try {
    fs.writeJsonSync(
      configPath,
      merge(userConfig, {
        compilerOptions: {
          noEmit: false,
          emitDeclarationOnly: true,
          outDir: 'types'
        },
        include: ['src/**/*', 'package.json', ...extraInclude]
      })
    )

    // run tsc
    await execa('tsc', ['-b', configPath, ...forwardOptions], {
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })

    // run typedoc
    await execa(
      'typedoc',
      [
        '--inputfiles',
        fromRoot('types', 'src'),
        '--mode',
        'modules',
        '--out',
        'docs',
        '--excludeExternals',
        // '--excludeNotDocumented',
        '--excludeNotExported',
        '--excludePrivate',
        '--excludeProtected',
        '--includeDeclarations',
        '--hideGenerator',
        '--includeVersion',
        '--gitRevision',
        'master',
        '--disableSources',
        '--tsconfig',
        configPath,
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
  } finally {
    fs.removeSync(configPath)
    fs.removeSync(fromRoot('types'))
  }
}
