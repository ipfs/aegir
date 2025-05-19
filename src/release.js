import { execa } from 'execa'
import Listr from 'listr'
import { isMonorepoProject, hasDocs, pkg } from './utils.js'

/**
 * @typedef {import('./types.js').GlobalOptions} GlobalOptions
 * @typedef {import('./types.js').ReleaseOptions} ReleaseOptions
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
        args = ['-e', 'semantic-release-monorepo', `--tag-format="${pkg.name}-\${version}"`, ...args]
      }

      await execa('semantic-release', args, {
        preferLocal: true,
        stdio: 'inherit'
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

export default tasks
