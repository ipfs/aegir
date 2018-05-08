
const lint = require('@commitlint/lint')
const read = require('@commitlint/read')
const load = require('@commitlint/load')
const util = require('util')

function exec (command) {
  return new Promise((resolve, reject) => {
    require('child_process').exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(stdout)
      }
    })
  })
}

module.exports = (options) => {
  return read(options)
    .then((commits) => Promise.all([commits, load({extends: ['@commitlint/config-conventional'] })]))
    .then(([commits, opts]) => Promise.all(commits.map((commit) => lint(
        commit,
        opts.rules,
        opts.parserPreset ? {parserOpts: opts.parserPreset.parserOpts} : {}
    ))))
    .then(results => results.filter((r) => !r.valid))
    .then(invalid => {
        if (invalid.length) {
          // TODO: better printing
          console.log(util.inspect(invalid, false, null))
          return 1
        } else {
          return 0
        }
    })
}
