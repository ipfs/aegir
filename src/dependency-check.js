import { cwd } from 'process'
import depcheck from 'depcheck'
import Listr from 'listr'

/**
 * @typedef {import("listr").ListrTaskWrapper} Task
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").DependencyCheckOptions} DependencyCheckOptions
 */

const tasks = new Listr(
  [
    {
      title: 'dependency-check',
      /**
       * @param {GlobalOptions & DependencyCheckOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const result = await depcheck(cwd(), {
          parsers: {
            '**/*.js': depcheck.parser.es6,
            '**/*.ts': depcheck.parser.typescript,
            '**/*.cjs': depcheck.parser.es6,
            '**/*.mjs': depcheck.parser.es6
          },
          ignoreMatches: ['eslint*', '@types/*', '@semantic-release/*'].concat(ctx.fileConfig.dependencyCheck.ignore).concat(ctx.ignore)
        })
        if (Object.keys(result.missing).length > 0 || (ctx.unused && (result.dependencies.length > 0 || result.devDependencies.length > 0))) {
          throw new Error(
            'Some dependencies are missing or unused.\n' +
            'Missing: \n' + Object.entries(result.missing).map(([dep, path]) => dep + ': ' + path).join('\n') +
            '\nUnused production dependencies: \n' + result.dependencies.join('\n') + '\n' +
            'Unused dev dependencies: \n' + result.devDependencies.join('\n')
          )
        }
      }
    }
  ]
)

export default tasks
