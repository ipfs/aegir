/* eslint-disable no-console */
'use strict'

const path = require('path')
const os = require('os')
const {
  exec
} = require('../utils')
const fs = require('fs-extra')
const glob = require('it-glob')

/**
 * @param {string} name
 * @param {{ dependencies: any; }} pkg
 */
const isDep = (name, pkg) => {
  return Object.keys(pkg.dependencies || {}).filter(dep => dep === name).pop()
}

/**
 * @param {string} name
 * @param {{ devDependencies: any; }} pkg
 */
const isDevDep = (name, pkg) => {
  return Object.keys(pkg.devDependencies || {}).filter(dep => dep === name).pop()
}

/**
 * @param {string} name
 * @param {{ optionalDendencies: any; }} pkg
 */
const isOptionalDep = (name, pkg) => {
  return Object.keys(pkg.optionalDendencies || {}).filter(dep => dep === name).pop()
}

/**
 * @param {string} name
 * @param {any} pkg
 */
const dependsOn = (name, pkg) => {
  return isDep(name, pkg) || isDevDep(name, pkg) || isOptionalDep(name, pkg)
}

/**
 * @param {string} targetDir
 */
const isMonoRepo = (targetDir) => {
  return fs.existsSync(path.join(targetDir, 'lerna.json'))
}

/**
 * @param {string} targetDir
 */
const hasNpmLock = (targetDir) => {
  return fs.existsSync(path.join(targetDir, 'package-lock.json')) ||
    fs.existsSync(path.join(targetDir, 'npm-shrinkwrap.json'))
}

/**
 * @param {string} targetDir
 */
const hasYarnLock = (targetDir) => {
  return fs.existsSync(path.join(targetDir, 'yarn.lock'))
}

/**
 * @param {string} targetDir
 */
const installDependencies = async (targetDir) => {
  console.info('Installing dependencies')
  if (hasYarnLock(targetDir)) {
    await exec('yarn', ['install'], {
      cwd: targetDir
    })
  } else if (hasNpmLock(targetDir)) {
    await exec('npm', ['ci'], {
      cwd: targetDir
    })
  } else {
    await exec('npm', ['install'], {
      cwd: targetDir
    })
  }
}

/**
 * Deps take the form:
 *
 * ```js
 * {
 *   "aegir": "^1.0.0",
 *   "ipfs": "/path/to/local/install",
 *   // etc
 * }
 * ```
 *
 * @param {string} targetDir
 * @param {Record<string, string>} deps
 */
const upgradeDependenciesInDir = async (targetDir, deps) => {
  const modulePkgPath = path.join(targetDir, 'package.json')
  const modulePkg = require(modulePkgPath)

  modulePkg.dependencies = modulePkg.dependencies || {}
  modulePkg.peerDependencies = modulePkg.peerDependencies || {}
  modulePkg.optionalDependencies = modulePkg.optionalDependencies || {}
  modulePkg.devDependencies = modulePkg.devDependencies || {}

  console.info('Upgrading deps')

  for (const dep of Object.keys(deps)) {
    const existingVersion = modulePkg.dependencies[dep] || modulePkg.peerDependencies[dep] || modulePkg.optionalDependencies[dep] || modulePkg.devDependencies[dep]
    console.info('Upgrading', dep, 'from version', existingVersion, 'to', deps[dep])

    if (modulePkg.dependencies[dep] || modulePkg.peerDependencies[dep] || modulePkg.optionalDependencies[dep]) {
      modulePkg.dependencies[dep] = deps[dep]
    } else if (modulePkg.devDependencies[dep]) {
      modulePkg.devDependencies[dep] = deps[dep]
    }
  }

  await fs.writeFile(modulePkgPath, JSON.stringify(modulePkg, null, 2))

  await exec('npm', ['install'], {
    cwd: targetDir
  })
}

/**
 * @param {string} targetDir
 * @param {{}} deps
 * @param {string} scriptName
 */
const testModule = async (targetDir, deps, scriptName) => {
  const pkgPath = path.join(targetDir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    throw new Error(`No package.json found at ${pkgPath}`)
  }

  const modulePkg = require(pkgPath)

  for (const dep of Object.keys(deps)) {
    if (!dependsOn(dep, modulePkg)) {
      throw new Error(`Module ${modulePkg.name} does not depend on ${dep}`)
    }
  }

  if (!modulePkg.scripts || !(scriptName in modulePkg.scripts)) {
    throw new Error(`Module ${modulePkg.name} does not have the script ${scriptName} to run`)
  }

  try {
    // run the tests without our upgrade - if they are failing, no point in continuing
    await exec('npm', [scriptName], {
      cwd: targetDir
    })
  } catch (/** @type {any} */ err) {
    throw new Error(`Failed to run the tests of ${modulePkg.name}, aborting ${err.message}`)
  }

  // upgrade passed dependencies
  await upgradeDependenciesInDir(targetDir, deps)

  // run the tests with the new deps
  await exec('npm', [scriptName], {
    cwd: targetDir
  })
}

/**
 * @param {string} targetDir
 * @param {any} deps
 * @param {string} scriptName
 */
const testRepo = async (targetDir, deps, scriptName) => {
  await installDependencies(targetDir)
  await testModule(targetDir, deps, scriptName)
}

/**
 * @param {string} targetDir
 * @param {any} deps
 * @param {string} scriptName
 */
const testMonoRepo = async (targetDir, deps, scriptName) => {
  await installDependencies(targetDir)

  let lerna = path.join('node_modules', '.bin', 'lerna')

  if (!fs.existsSync(lerna)) {
    // no lerna in project dependencies :(
    await exec('npm', ['install', '-g', 'lerna'], {
      cwd: targetDir
    })
    lerna = 'lerna'
  }

  await exec(lerna, ['bootstrap'], {
    cwd: targetDir
  })

  // read package targetDir config
  const config = require(path.join(targetDir, 'lerna.json'))

  // find where the packages are stored
  let packages = config.packages || 'packages'

  if (!Array.isArray(packages)) {
    packages = [packages]
  }

  // test each package that depends on ipfs/http client
  for (const pattern of packages) {
    for await (const match of glob(targetDir, pattern)) {
      await testModule(path.join(targetDir, match), deps, scriptName)
    }
  }
}

/**
 * @param {{ repo: string; branch: string; deps: any; scriptName: string; }} opts
 */
async function testDependant (opts) {
  const targetDir = path.join(os.tmpdir(), `test-dependant-${Date.now()}`)

  console.info(`Cloning ${opts.repo} into ${targetDir}`)
  await exec('git', ['clone', opts.repo, targetDir], {
    quiet: true
  })

  if (opts.branch) {
    await exec('git', ['checkout', opts.branch], {
      cwd: targetDir
    })
  }

  if (isMonoRepo(targetDir)) {
    await testMonoRepo(targetDir, opts.deps, opts.scriptName)
  } else {
    await testRepo(targetDir, opts.deps, opts.scriptName)
  }

  console.info(`Removing ${targetDir}`)
  await fs.remove(targetDir)
}

module.exports = testDependant
