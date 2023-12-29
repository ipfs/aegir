/* eslint-disable no-console */

import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
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
        let missingOrUnusedPresent = false

        // check production dependencies
        const manifest = JSON.parse(fs.readFileSync(path.join(cwd(), 'package.json'), 'utf-8'))

        const productionOnlyResult = await depcheck(cwd(), {
          parsers: {
            '**/*.js': depcheck.parser.es6,
            '**/*.ts': depcheck.parser.typescript,
            '**/*.cjs': depcheck.parser.es6,
            '**/*.mjs': depcheck.parser.es6
          },
          ignoreMatches: ignoredDevDependencies.concat(ctx.fileConfig.dependencyCheck.ignore).concat(ctx.ignore),
          ignorePatterns: ctx.productionIgnorePatterns,
          package: {
            ...manifest,
            devDependencies: {}
          }
        })

        if (Object.keys(productionOnlyResult.missing).length > 0) {
          missingOrUnusedPresent = true
          console.error('')
          console.error('Missing production dependencies:')
          console.error('')

          Object.entries(productionOnlyResult.missing).forEach(([dep, path]) => {
            console.error(kleur.red(dep))
            console.error(' ', kleur.gray(path.join('\n  ')))
          })

          console.error('')
        }

        if (productionOnlyResult.dependencies.length > 0) {
          missingOrUnusedPresent = true
          console.error('')
          console.error('Unused production dependencies:')
          console.error('')

          productionOnlyResult.dependencies.forEach(dep => {
            console.error(kleur.yellow(dep))
          })

          console.error('')
        }

        // check dev dependencies
        const devlopmentOnlyResult = await depcheck(cwd(), {
          parsers: {
            '**/*.js': depcheck.parser.es6,
            '**/*.ts': depcheck.parser.typescript,
            '**/*.cjs': depcheck.parser.es6,
            '**/*.mjs': depcheck.parser.es6
          },
          ignoreMatches: ignoredDevDependencies.concat(ctx.fileConfig.dependencyCheck.ignore).concat(ctx.ignore),
          ignorePatterns: ctx.developmentIgnorePatterns
        })

        if (Object.keys(devlopmentOnlyResult.missing).length > 0) {
          missingOrUnusedPresent = true
          console.error('')
          console.error('Missing development dependencies:')
          console.error('')

          Object.entries(devlopmentOnlyResult.missing).forEach(([dep, path]) => {
            console.error(kleur.red(dep))
            console.error(' ', kleur.gray(path.join('\n  ')))
          })

          console.error('')
        }

        if (devlopmentOnlyResult.devDependencies.length > 0) {
          missingOrUnusedPresent = true
          console.error('')
          console.error('Unused development dependencies:')
          console.error('')

          devlopmentOnlyResult.devDependencies.forEach(dep => {
            console.error(kleur.yellow(dep))
          })
          console.error('')
        }

        if (missingOrUnusedPresent) {
          throw new Error('Some dependencies are missing or unused')
        }
      }
    }
  ]
)

export default tasks
