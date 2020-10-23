'use strict'

const path = require('path')
const os = require('os')
const {
  exec
} = require('../utils')
const fs = require('fs-extra')
const glob = require('it-glob')

const isDep = (name, pkg) => {
  return Object.keys(pkg.dependencies || {}).filter(dep => dep === name).pop()
}

const isDevDep = (name, pkg) => {
  return Object.keys(pkg.devDependencies || {}).filter(dep => dep === name).pop()
}

const isOptionalDep = (name, pkg) => {
  return Object.keys(pkg.optionalDendencies || {}).filter(dep => dep === name).pop()
}

const dependsOn = (name, pkg) => {
  return isDep(name, pkg) || isDevDep(name, pkg) || isOptionalDep(name, pkg)
}

const isMonoRepo = (targetDir) => {
  return fs.existsSync(path.join(targetDir, 'lerna.json'))
}

const hasNpmLock = (targetDir) => {
  return fs.existsSync(path.join(targetDir, 'package-lock.json')) ||
    fs.existsSync(path.join(targetDir, 'npm-shrinkwrap.json'))
}

const hasYarnLock = (targetDir) => {
  return fs.existsSync(path.join(targetDir, 'yarn.lock'))
}

const printFailureMessage = (message) => {
  console.info('-------------------------------------------------------------------') // eslint-disable-line no-console
  console.info('') // eslint-disable-line no-console
  console.info(message) // eslint-disable-line no-console
  console.info('') // eslint-disable-line no-console
  console.info('Dependant project has not been tested with updated dependencies') // eslint-disable-line no-console
  console.info('') // eslint-disable-line no-console
  console.info('-------------------------------------------------------------------') // eslint-disable-line no-console
}

const installDependencies = async (targetDir) => {
  console.info('Installing dependencies') // eslint-disable-line no-console
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

const upgradeDependenciesInDir = async (targetDir, deps) => {
  const modulePkgPath = path.join(targetDir, 'package.json')
  const modulePkg = require(modulePkgPath)

  modulePkg.dependencies = modulePkg.dependencies || {}
  modulePkg.peerDependencies = modulePkg.peerDependencies || {}
  modulePkg.optionalDependencies = modulePkg.optionalDependencies || {}
  modulePkg.devDependencies = modulePkg.devDependencies || {}

  console.info('Upgrading deps') // eslint-disable-line no-console

  for (const dep of Object.keys(deps)) {
    const existingVersion = modulePkg.dependencies[dep] || modulePkg.peerDependencies[dep] || modulePkg.optionalDependencies[dep] || modulePkg.devDependencies[dep]
    console.info('Upgrading', dep, 'from version', existingVersion, 'to', deps[dep]) // eslint-disable-line no-console

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

const testModule = async (targetDir, deps) => {
  const pkgPath = path.join(targetDir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    printFailureMessage(`No package.json found at ${pkgPath}`)

    return
  }

  const modulePkg = require(pkgPath)

  for (const dep of Object.keys(deps)) {
    if (!dependsOn(dep, modulePkg)) {
      printFailureMessage(`Module ${modulePkg.name} does not depend on ${dep}`)

      return
    }
  }

  if (!modulePkg.scripts || !modulePkg.scripts.test) {
    printFailureMessage(`Module ${modulePkg.name} has no tests`)

    return
  }

  try {
    // run the tests without our upgrade - if they are failing, no point in continuing
    await exec('npm', ['test'], {
      cwd: targetDir
    })
  } catch (err) {
    printFailureMessage(`Failed to run the tests of ${modulePkg.name}, aborting`, err.message)

    return
  }

  // upgrade passed dependencies
  await upgradeDependenciesInDir(targetDir, deps)

  // run the tests with the new deps
  await exec('npm', ['test'], {
    cwd: targetDir
  })
}

const testRepo = async (targetDir, deps) => {
  await installDependencies(targetDir)
  await testModule(targetDir, deps)
}

const testMonoRepo = async (targetDir, deps) => {
  await installDependencies(targetDir)

  let lerna = path.join('node_modules', '.bin', 'lerna')

  if (!fs.existsSync(lerna)) {
    // no lerna in project depenencies :(
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
      await testModule(path.join(targetDir, match), deps)
    }
  }
}

async function testDependant (opts) {
  const targetDir = path.join(os.tmpdir(), `test-dependant-${Date.now()}`)

  console.info(`Cloning ${opts.repo} into ${targetDir}`) // eslint-disable-line no-console
  await exec('git', ['clone', opts.repo, targetDir], {
    quiet: true
  })

  if (opts.branch) {
    await exec('git', ['checkout', opts.branch], {
      cwd: targetDir
    })
  }

  if (isMonoRepo(targetDir)) {
    await testMonoRepo(targetDir, opts.deps)
  } else {
    await testRepo(targetDir, opts.deps)
  }

  console.info(`Removing ${targetDir}`) // eslint-disable-line no-console
  await fs.remove(targetDir)
}

module.exports = testDependant
