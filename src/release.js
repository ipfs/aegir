/* eslint-disable no-console */

import Listr from 'listr'
import { execa } from 'execa'
import { isMonorepoProject, hasDocs, glob } from './utils.js'
import fs from 'fs-extra'
import path from 'path'
import { calculateSiblingVersion } from './check-project/utils.js'

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").ReleaseOptions} ReleaseOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 */

const tasks = new Listr([
  {
    title: 'generate typedoc urls',
    enabled: () => hasDocs,
    task: async () => {
      await execa('npm', ['run', 'docs', '--if-present', '--', '--publish', 'false'], {
        stdio: 'inherit'
      })
    }
  },
  {
    title: `semantic-release${isMonorepoProject() ? '-monorepo' : ''}`,
    /**
     * @param {GlobalOptions} ctx
     */
    task: async (ctx) => {
      let args = ctx['--'] ?? []

      if (isMonorepoProject()) {
        args = ['-e', 'semantic-release-monorepo', ...args]
      }

      await execa('semantic-release', args, {
        preferLocal: true,
        stdio: 'inherit'
      })
    }
  },
  {
    title: 'align sibling dependency versions',
    enabled: () => isMonorepoProject(),
    /**
     * @param {GlobalOptions & ReleaseOptions} ctx
     */
    task: async (ctx) => {
      const parentManifestPath = path.resolve(path.join(process.cwd(), '..', '..', 'package.json'))
      const rootDir = path.dirname(parentManifestPath)
      const parentManifest = fs.readJSONSync(parentManifestPath)
      const workspaces = parentManifest.workspaces

      if (!workspaces || !Array.isArray(workspaces)) {
        throw new Error('No monorepo workspaces found')
      }

      const {
        siblingVersions,
        packageDirs
      } = await calculateSiblingVersions(rootDir, workspaces)

      // check these dependency types for monorepo siblings
      const dependencyTypes = [
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'optionalDependencies'
      ]

      // align the versions of siblings in each package
      for (const packageDir of packageDirs) {
        const manifestPath = path.join(packageDir, 'package.json')
        const manifest = fs.readJSONSync(path.join(packageDir, 'package.json'))

        for (const type of dependencyTypes) {
          for (const [dep, version] of Object.entries(siblingVersions)) {
            if (manifest[type] != null && manifest[type][dep] != null && manifest[type][dep] !== version) {
              console.info('Update', type, dep, manifest[type][dep], '->', version) // eslint-disable-line no-console
              manifest[type][dep] = version
            }
          }
        }

        fs.writeJSONSync(manifestPath, manifest, {
          spaces: 2
        })
      }

      // all done, commit changes and push to remote
      const status = await execa('git', ['status', '--porcelain'], {
        cwd: rootDir
      })

      if (status.stdout === '') {
        // no changes, nothing to do
        return
      }

      // When running on CI, set the commits author and commiter info and prevent the `git` CLI to prompt for username/password.
      // Borrowed from `semantic-release`
      process.env.GIT_AUTHOR_NAME = ctx.siblingDepUpdateName
      process.env.GIT_AUTHOR_EMAIL = ctx.siblingDepUpdateEmail
      process.env.GIT_COMMITTER_NAME = ctx.siblingDepUpdateName
      process.env.GIT_COMMITTER_EMAIL = ctx.siblingDepUpdateEmail
      process.env.GIT_ASKPASS = 'echo'
      process.env.GIT_TERMINAL_PROMPT = '0'

      console.info(`Commit with message "${ctx.siblingDepUpdateMessage}"`) // eslint-disable-line no-console
      await execa('git', ['add', '-A'], {
        cwd: rootDir
      })
      await execa('git', ['commit', '-m', ctx.siblingDepUpdateMessage], {
        cwd: rootDir
      })
      console.info('Push to remote') // eslint-disable-line no-console
      await execa('git', ['push'], {
        cwd: rootDir
      })
    }
  },
  {
    title: 'publish documentation',
    enabled: () => hasDocs,
    task: async () => {
      await execa('npm', ['run', 'docs', '--if-present'], {
        stdio: 'inherit'
      })
    }
  }
], { renderer: 'verbose' })

/**
 * @param {string} rootDir
 * @param {string[]} workspaces
 */
async function calculateSiblingVersions (rootDir, workspaces) {
  const packageDirs = []

  /** @type {Record<string, string>} */
  const siblingVersions = {}

  for (const workspace of workspaces) {
    for await (const subProjectDir of glob(rootDir, workspace, {
      cwd: rootDir,
      absolute: true
    })) {
      const pkg = JSON.parse(fs.readFileSync(path.join(subProjectDir, 'package.json'), {
        encoding: 'utf-8'
      }))

      siblingVersions[pkg.name] = calculateSiblingVersion(pkg.version)
      packageDirs.push(subProjectDir)
    }
  }

  return {
    packageDirs,
    siblingVersions
  }
}

export default tasks
