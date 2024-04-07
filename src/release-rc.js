/* eslint-disable no-console */

import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import Listr from 'listr'
import retry from 'p-retry'
import { isMonorepoParent, pkg, everyMonorepoProject, pipeOutput } from './utils.js'

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").ReleaseRcOptions} ReleaseRcOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 */

/**
 * @param {string} commit
 * @param {ReleaseRcOptions} ctx
 */
async function releaseMonorepoRcs (commit, ctx) {
  // collect monorepo package versions
  /** @type {Record<string, string>} */
  const versions = {}

  await everyMonorepoProject(async (project) => {
    if (project.manifest.private === true) {
      console.info(`Skipping private package ${project.manifest.name}`)
      return
    }

    versions[project.manifest.name] = `${project.manifest.version}-${commit}`
  }, {
    concurrency: ctx.concurrency
  })

  console.info('Will release the following packages:')
  console.info('')

  Object.entries(versions).forEach(([name, version]) => {
    console.info(`  ${name}@${version}`)
  })

  console.info('')

  // publish packages
  await everyMonorepoProject(async (project) => {
    if (project.manifest.private === true) {
      console.info(`Skipping private package ${project.manifest.name}`)
      return
    }

    console.info(`Updating dependencies of ${project.manifest.name}`)

    versions[project.manifest.name] = `${project.manifest.version}-${commit}`

    project.manifest.version = `${project.manifest.version}-${commit}`

    for (const [name, version] of Object.entries(versions)) {
      if (project.manifest.dependencies != null && project.manifest.dependencies[name] != null) {
        console.info(`  Override sibling dependency ${name}@${project.manifest.dependencies[name]} -> ${name}${version}`)
        project.manifest.dependencies[name] = version
      }

      if (project.manifest.devDependencies != null && project.manifest.devDependencies[name] != null) {
        console.info(`  Override sibling dev dependency ${name}@${project.manifest.devDependencies[name]} -> ${name}${version}`)
        project.manifest.devDependencies[name] = version
      }

      if (project.manifest.optionalDependencies != null && project.manifest.optionalDependencies[name] != null) {
        console.info(`  Override sibling optional dependency ${name}@${project.manifest.optionalDependencies[name]} -> ${name}${version}`)
        project.manifest.optionalDependencies[name] = version
      }
    }

    await fs.writeJSON(path.join(project.dir, 'package.json'), project.manifest, {
      spaces: 2
    })

    await retry(async () => {
      console.info(`npm publish --tag ${ctx.tag} --dry-run ${!process.env.CI}`)

      try {
        const subprocess = execa('npm', ['publish', '--tag', ctx.tag, '--dry-run', `${!process.env.CI}`], {
          cwd: project.dir
        })
        pipeOutput(subprocess, project.manifest.name, ctx.prefix)
        await subprocess
      } catch (/** @type {any} */ err) {
        if (err.all?.includes('You cannot publish over the previously published versions')) {
          // this appears to be a bug in npm, sometimes you publish successfully but it also
          // returns an error
          return
        }

        throw err
      }
    }, {
      retries: ctx.retries
    })

    console.info('')
  }, {
    concurrency: ctx.concurrency
  })
}

/**
 * @param {string} commit
 * @param {ReleaseRcOptions} ctx
 */
async function releaseRc (commit, ctx) {
  if (pkg.private === true) {
    console.info(`Skipping private package ${pkg.name}`)
    return
  }

  console.info(`npm version ${pkg.version}-${commit} --no-git-tag-version`)
  await execa('npm', ['version', `${pkg.version}-${commit}`, '--no-git-tag-version'], {
    stdout: 'inherit',
    stderr: 'inherit'
  })

  await retry(async () => {
    console.info(`npm publish --tag ${ctx.tag} --dry-run ${!process.env.CI}`)

    try {
      await execa('npm', ['publish', '--tag', ctx.tag, '--dry-run', `${!process.env.CI}`], {
        stdout: 'inherit',
        stderr: 'inherit',
        all: true
      })
    } catch (/** @type {any} */ err) {
      if (err.all?.includes('You cannot publish over the previously published versions')) {
        // this appears to be a bug in npm, sometimes you publish successfully but it also
        // returns an error
        return
      }

      throw err
    }
  }, {
    retries: ctx.retries
  })
}

const tasks = new Listr([
  {
    title: 'Release RC',
    /**
     * @param {GlobalOptions & ReleaseRcOptions} ctx
     */
    task: async (ctx) => {
      const commit = await execa('git', ['rev-parse', '--short', 'HEAD'])

      if (isMonorepoParent) {
        await releaseMonorepoRcs(commit.stdout, ctx)
      } else {
        await releaseRc(commit.stdout, ctx)
      }
    }
  }
], { renderer: 'verbose' })

export default tasks
