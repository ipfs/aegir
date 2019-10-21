'use strict'

const path = require('path')
const os = require('os')
const {
  exec
} = require('../utils')
const fs = require('fs-extra')
const glob = require('it-glob')

const findHttpClientPkg = (targetDir) => {
  const location = require.resolve('ipfs-http-client', {
    paths: [
      targetDir
    ]
  })

  return require(location.replace('src/index.js', 'package.json'))
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

const removeExtraIPFSInstalls = async (targetDir) => {
  for await (const extra of glob(targetDir, 'node_modules/**/node_modules/{ipfs,ipfs-http-client}')) {
    console.info('Removing extra module', extra) // eslint-disable-line no-console
    await fs.remove(extra)
  }
}

const linkIPFSInDir = async (targetDir, ipfsDir, ipfsPkg, httpClientPkg) => {
  // if the project also depends on the http client, upgrade it to the same version we are using
  if (fs.existsSync(path.join(targetDir, 'node_modules', 'ipfs-http-client'))) {
    console.info('Upgrading ipfs-http-client dependency to', httpClientPkg.version) // eslint-disable-line no-console
    await exec('npm', ['install', `ipfs-http-client@${httpClientPkg.version}`], {
      cwd: targetDir
    })
  }

  console.info(`Linking ipfs@${ipfsPkg.version} in dir ${targetDir}`) // eslint-disable-line no-console
  await exec('npx', ['connect-deps', 'link', path.relative(await fs.realpath(targetDir), await fs.realpath(ipfsDir))], {
    cwd: targetDir
  })
  await exec('npx', ['connect-deps', 'connect'], {
    cwd: targetDir
  })

  // remove extraneous `ipfs` and `ipfs-http-client` dependencies
  console.info('Removing any non-top-level ipfs/ipfs-http-client deps') // eslint-disable-line no-console
  await removeExtraIPFSInstalls(targetDir)
}

const testModule = async (targetDir, ipfsDir, ipfsPkg, httpClientPkg) => {
  const pkgPath = path.join(targetDir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    console.info(`No package.json found at ${pkgPath}`) // eslint-disable-line no-console

    return
  }

  const modulePkg = require(pkgPath)

  if (!fs.existsSync(path.join(targetDir, 'node_modules', 'ipfs')) && !fs.existsSync(path.join(targetDir, 'node_modules', 'ipfs'))) {
    console.info(`Module ${modulePkg.name} have IPFS or the IPFS HTTP Client in it's dependency tree`) // eslint-disable-line no-console

    return
  }

  if (!modulePkg.scripts || !modulePkg.scripts.test) {
    console.info(`Module ${modulePkg.name} has no tests`) // eslint-disable-line no-console

    return
  }

  try {
    // run the tests without our upgrade - if they are failing, no point in continuing
    await exec('npm', ['test'], {
      cwd: targetDir
    })
  } catch (err) {
    console.info(`Failed to run the tests of ${modulePkg.name}, aborting`, err.message) // eslint-disable-line no-console

    return
  }

  // upgrade IPFS to the rc
  await linkIPFSInDir(targetDir, ipfsDir, ipfsPkg, httpClientPkg)

  // run the tests with the new IPFS/IPFSHTTPClient
  await exec('npm', ['test'], {
    cwd: targetDir
  })
}

const testRepo = async (targetDir, ipfsDir, ipfsPkg, httpClientPkg) => {
  await installDependencies(targetDir)
  await testModule(targetDir, ipfsDir, ipfsPkg, httpClientPkg)
}

const testMonoRepo = async (targetDir, ipfsDir, ipfsPkg, httpClientPkg) => {
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
      await testModule(path.join(targetDir, match), ipfsDir, ipfsPkg, httpClientPkg)
    }
  }
}

async function testExternal (opts) {
  // work out our versions
  const ipfsDir = process.cwd()
  const ipfsPkg = require(path.join(ipfsDir, 'package.json'))
  const httpClientPkg = findHttpClientPkg(ipfsDir)
  const targetDir = path.join(os.tmpdir(), `${opts.name}-${Date.now()}`)

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
    await testMonoRepo(targetDir, ipfsDir, ipfsPkg, httpClientPkg)
  } else {
    await testRepo(targetDir, ipfsDir, ipfsPkg, httpClientPkg)
  }

  console.info(`Removing ${targetDir}`) // eslint-disable-line no-console
  await fs.remove(targetDir)
}

module.exports = testExternal
