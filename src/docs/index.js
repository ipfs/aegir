'use strict'

const Listr = require('listr')
const chalk = require('chalk')
const { premove: remove } = require('premove')
const { getListrConfig, publishDocs, hasTsconfig } = require('../utils')
const tsCmd = require('../ts')

const TASKS = new Listr(
  [
    {
      title: 'Clean ./docs',
      task: () => remove('docs')
    },
    {
      title: 'Generating documentation',
      task: () => {
        if (!hasTsconfig) {
          // eslint-disable-next-line no-console
          console.error(chalk.yellow('Documentation requires typescript config.\nTry running `aegir ts --preset config > tsconfig.json`'))
          return
        }

        return tsCmd({ preset: 'docs' })
      }
    },
    {
      title: 'Publish to GitHub Pages',
      task: publishDocs,
      enabled: (ctx) => ctx.publish && hasTsconfig
    }
  ],
  getListrConfig()
)

module.exports = TASKS
