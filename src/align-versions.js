/* eslint-disable no-console */

import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import Listr from 'listr'
import { calculateSiblingVersion } from './check-project/utils.js'
import { isMonorepoRoot, getSubProjectDirectories, pkg } from './utils.js'

/**
 * @typedef {import("./types.js").GlobalOptions} GlobalOptions
 * @typedef {import("./types.js").ReleaseOptions} ReleaseOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 */

const tasks = new Listr([
  {
    title: 'align sibling dependency versions',
    enabled: () => isMonorepoRoot(),
    /**
     * @param {GlobalOptions & ReleaseOptions} ctx
     */
    task: async (ctx) => {
      if (process.env.CI == null) {
        console.info('⚠ This run was not triggered in a known CI environment, running in dry-run mode.')
        return
      }

      const rootDir = process.cwd()
      const { workspaces } = pkg

      if (workspaces == null || !Array.isArray(workspaces)) {
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

        console.info('check project', manifest.name)

        for (const type of dependencyTypes) {
          for (const [dep, version] of Object.entries(siblingVersions)) {
            if (manifest[type] != null && manifest[type][dep] != null && manifest[type][dep] !== version) {
              console.info('Update', type, dep, manifest[type][dep], '->', version)
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

      if (!process.env.CI) {
        // do not push to remote repo if in dry-run mode
        return
      }

      // When running on CI, set the commits author and committer info and prevent the `git` CLI to prompt for username/password.
      // Borrowed from `semantic-release`
      process.env.GIT_AUTHOR_NAME = ctx.siblingDepUpdateName
      process.env.GIT_AUTHOR_EMAIL = ctx.siblingDepUpdateEmail
      process.env.GIT_COMMITTER_NAME = ctx.siblingDepUpdateName
      process.env.GIT_COMMITTER_EMAIL = ctx.siblingDepUpdateEmail
      process.env.GIT_ASKPASS = 'echo'
      process.env.GIT_TERMINAL_PROMPT = '0'

      console.info(`Commit with message "${ctx.siblingDepUpdateMessage}"`)

      await execa('git', ['add', '-A'], {
        cwd: rootDir
      })
      await execa('git', ['commit', '-m', ctx.siblingDepUpdateMessage], {
        cwd: rootDir
      })
      console.info('Push to remote')
      await execa('git', ['push'], {
        cwd: rootDir
      })
    }
  }
], { renderer: 'verbose' })

/**
 * @param {string} rootDir
 * @param {string[]} workspaces
 * @returns {Promise<{ packageDirs: string[], siblingVersions: Record<string, string> }>}
 */
async function calculateSiblingVersions (rootDir, workspaces) {
  const packageDirs = []

  /** @type {Record<string, string>} */
  const siblingVersions = {}

  for (const subProjectDir of await getSubProjectDirectories(rootDir, workspaces)) {
    const pkg = JSON.parse(fs.readFileSync(path.join(subProjectDir, 'package.json'), {
      encoding: 'utf-8'
    }))

    siblingVersions[pkg.name] = calculateSiblingVersion(pkg.version)
    packageDirs.push(subProjectDir)
  }

  return {
    packageDirs,
    siblingVersions
  }
}

export default tasks
