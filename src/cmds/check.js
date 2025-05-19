/* eslint-disable guard-for-in */
/* eslint-disable max-depth */
/* eslint-disable no-console */

import path from 'path'
import esbuild from 'esbuild'
import fs from 'fs-extra'
import kleur from 'kleur'
import { readPackageUp } from 'read-pkg-up'
import { loadUserConfig } from '../config/user.js'
import merge from '../utils/merge-options.js'
import { fromRoot, paths } from '../utils.js'

const defaults = merge.bind({
  ignoreUndefined: true,
  concatArrays: true
})

/**
 * @typedef {import("yargs").CommandModule} CommandModule
 */

/** @type {CommandModule} */
export default {
  command: 'check',
  describe: 'Check project',
  /**
   * @param {any} argv
   */
  async handler (argv) {
    return checkBuiltins(argv)
  }
}

/**
 * @param {{ tsRepo: any; }} argv
 */
const checkBuiltins = async (argv) => {
  const outfile = path.join(paths.dist, 'index.js')
  const metafile = path.join(paths.dist, 'stats.json')
  /** @type {Record<string, string[]>} */
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
    /**
     *
     * @param {import('esbuild').PluginBuild} build
     */
    setup (build) {
      for (const k of Object.keys(nodeBuiltIns)) {
        build.onResolve({ filter: new RegExp(`^${k}$`) }, (args) => {
          nodeBuiltIns[k].push(args.importer)
          return null
        })
      }
    }
  }

  /** @type {import('esbuild').BuildOptions} */
  const esbuildOptions = {
    entryPoints: [
      fromRoot('src', argv.tsRepo ? 'index.ts' : 'index.js')
    ],
    bundle: true,
    mainFields: ['browser', 'module', 'main'],
    sourcemap: true,
    minify: false,
    metafile: true,
    outfile,
    plugins: [nodePlugin],
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  }
  const userConfig = await loadUserConfig()
  const result = await esbuild.build(defaults(esbuildOptions, userConfig.build.config))
  if (result.metafile) {
    fs.writeJSONSync(metafile, result.metafile)
  }
  const { outputs } = fs.readJSONSync(metafile)

  await findBuiltins(nodeBuiltIns)
  findDuplicates(outputs['dist/index.js'].inputs)
}

/**
 * @param {{}} inputs
 */
const findDuplicates = async (inputs) => {
  const files = Object.keys(inputs)
  /** @type {Record<string,Set<string>>} */
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
        const out = await readPackageUp({ cwd: file })
        if (out) {
          console.log(kleur.dim(file), kleur.blue(out.packageJson.version))
        }
      }
    }
  }
}

/**
 * @param {Record<string, string[]>} nodeBuiltIns
 */
const findBuiltins = async (nodeBuiltIns) => {
  /** @type {Record<string, Set<string>>} */
  const packages = {}

  for (const builtin in nodeBuiltIns) {
    for (const importer of nodeBuiltIns[builtin]) {
      const out = await readPackageUp({ cwd: importer })
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
