/* eslint-disable guard-for-in */
/* eslint-disable max-depth */
/* eslint-disable no-console */
'use strict'
const esbuild = require('esbuild')
const fs = require('fs-extra')
const findPkg = require('read-pkg-up')
const kleur = require('kleur')
const { userConfig } = require('../src/config/user')
const path = require('path')
const { fromRoot, paths } = require('../src/utils')
const merge = require('merge-options').bind({
  ignoreUndefined: true,
  concatArrays: true
})
module.exports = {
  command: 'check',
  desc: 'Check project',
  builder: {},
  handler (argv) {
    return checkBuiltins(argv)
  }
}

const checkBuiltins = async (argv) => {
  const outfile = path.join(paths.dist, 'index.js')
  const metafile = path.join(paths.dist, 'stats.json')
  const nodeBuiltIns = {
    util: [],
    sys: [],
    events: [],
    stream: [],
    path: [],
    querystring: [],
    punycode: [],
    url: [],
    string_decoder: [],
    http: [],
    https: [],
    os: [],
    assert: [],
    constants: [],
    timers: [],
    vm: [],
    zlib: [],
    tty: [],
    domain: []
  }
  const nodePlugin = {
    name: 'node built ins',
    setup (build) {
      for (const k of Object.keys(nodeBuiltIns)) {
        build.onResolve({ filter: new RegExp(`^${k}$`) }, (args) => {
          nodeBuiltIns[k].push(args.importer)
          return null
        })
      }
    }
  }

  await esbuild.build(
    merge(
      {
        entryPoints: [
          fromRoot('src', argv.tsRepo ? 'index.ts' : 'index.js')
        ],
        bundle: true,
        mainFields: ['browser', 'module', 'main'],
        sourcemap: true,
        minify: false,
        metafile,
        outfile,
        plugins: [nodePlugin],
        define: {
          'process.env.NODE_ENV': '"production"'
        }
      },
      userConfig.build.config
    )
  )

  const { outputs } = fs.readJSONSync(metafile)

  await findBuiltins(nodeBuiltIns)
  findDuplicates(outputs['dist/index.js'].inputs)
}

const findDuplicates = async (inputs) => {
  const files = Object.keys(inputs)
  const packages = {}
  for (const file of files) {
    if (file.includes('node_modules') && !file.includes('empty:')) {
      const parts = file.split('/')
      const last = parts.lastIndexOf('node_modules')
      let name
      let path
      if (parts[last + 1].startsWith('@')) {
        name = parts[last + 1] + '/' + parts[last + 2]
        path = parts.slice(0, last + 3)
      } else {
        name = parts[last + 1]
        path = parts.slice(0, last + 2)
      }

      if (packages[name]) {
        packages[name].add(path.join('/'))
      } else {
        packages[name] = new Set()
        packages[name].add(path.join('/'))
      }
    }
  }

  // we have all the packages
  console.log(kleur.red('Dependencies duplication'))
  for (const key in packages) {
    const imports = packages[key]
    if (imports.size > 1) {
      console.log(kleur.red(key))
      for (const file of imports) {
        const out = await findPkg({ cwd: file })
        console.log(kleur.dim(file), kleur.blue(out.packageJson.version))
      }
    }
  }
}

const findBuiltins = async (nodeBuiltIns) => {
  const packages = {}
  // eslint-disable-next-line guard-for-in
  for (const builtin in nodeBuiltIns) {
    for (const importer of nodeBuiltIns[builtin]) {
      const out = await findPkg({ cwd: importer })
      let isOk = false
      if (out) {
        if (out.packageJson.dependencies) {
          const deps = Object.keys(out.packageJson.dependencies)
          if (deps.includes(builtin)) {
            isOk = true
          }
        }

        if (!isOk && out.packageJson.browser) {
          const deps = Object.keys(out.packageJson.browser)
          if (deps.includes(builtin)) {
            isOk = true
          }
        }
      }
      if (!isOk) {
        if (!packages[builtin]) {
          packages[builtin] = new Set()
        }
        const relativePath = path.relative(
          process.cwd(),
          importer
        )
        packages[builtin].add(relativePath)
      }
    }
  }

  if (Object.keys(packages).length > 0) {
    console.log(kleur.red('Files missing node built-ins dependencies'))
    console.log(packages)
  } else {
    console.log(kleur.green('All inputs register dependencies or polyfills for node built-ins.'))
  }
}
