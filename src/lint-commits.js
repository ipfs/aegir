'use strict'

const loadCommitLintConfig = require('@commitlint/load')
const readCommits = require('@commitlint/read')
const lintCommitMessage = require('@commitlint/lint')
const conventionalCommits = require('@commitlint/config-conventional')

function lintCommitMessages (opts = {}) {
  const from = opts.from || 'remotes/origin/master'
  const to = opts.to || 'HEAD'

  return Promise.all([
    loadCommitLintConfig({
      rules: conventionalCommits.rules
    }),
    readCommits({
      from,
      to
    })
  ])
    .then(([ { rules, parserPreset }, commits ]) => {
      return Promise.all(
        commits.map(commit => {
          return lintCommitMessage(commit, rules, parserPreset ? { parserOpts: parserPreset.parserOpts } : {})
        })
      )
    })
    .then(results => {
      let valid = true

      results.forEach(report => {
        if (valid === true) {
          valid = report.valid
        }

        const firstLine = `${report.input.trim().split('\n')[0]}`.trim()

        if (!report.valid) {
          console.log(`Commit message '${firstLine}' failed validation:`)
          console.log('')

          report.errors.forEach(error => {
            console.log('  [ERROR]', `${error.name}:`, error.message)
          })

          report.warnings.forEach(warning => {
            console.log('  [WARNING]', `${warning.name}:`, warning.message)
          })

          console.log('')
        }
      })

      if (!valid) {
        throw new Error(`Linting commits ${from}..${to} failed`)
      }
    })
}

function lintCommits (opts) {
  return lintCommitMessages(opts)
}

module.exports = lintCommits
