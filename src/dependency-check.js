/* eslint-disable no-console */

import { cwd } from 'process'
import depcheck from 'depcheck'
import kleur from 'kleur'
import Listr from 'listr'

const ignoredDevDependencies = [
  '@types/*',
  'aegir',
  'mkdirp',
  'rimraf',
  'protons',
  'eslint*',
  '@types/*',
  '@semantic-release/*'
]

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
          ignoreMatches: ignoredDevDependencies.concat(ctx.fileConfig?.dependencyCheck?.ignore || []).concat(ctx.ignore)
        })

        if (Object.keys(result.missing).length > 0 || result.dependencies.length > 0 || result.devDependencies.length > 0) {
          if (Object.keys(result.missing).length > 0) {
            console.error('')
            console.error('Missing dependencies:')
            console.error('')

            Object.entries(result.missing).forEach(([dep, path]) => {
              console.error(kleur.red(dep))
              console.error(' ', kleur.gray(path.join('\n  ')))
            })
          }

          if (result.dependencies.length > 0) {
            console.error('')
            console.error('Unused production dependencies:')
            console.error('')

            result.dependencies.forEach(dep => {
              console.error(kleur.yellow(dep))
            })
          }

          if (result.devDependencies.length > 0) {
            console.error('')
            console.error('Unused dev dependencies:')
            console.error('')

            result.devDependencies.forEach(dep => {
              console.error(kleur.yellow(dep))
            })
          }

          // necessary because otherwise listr removes the last line of output
          console.error(' ')

          throw new Error('Some dependencies are missing or unused')
        }
      }
    }
  ]
)

export default tasks
