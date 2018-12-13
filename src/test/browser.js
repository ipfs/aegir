'use strict'
const execao = require('execa-output')
const execa = require('execa')
const path = require('path')
const { throwError } = require('rxjs')
const { catchError } = require('rxjs/operators')
const { hook, fromAegir } = require('../utils')

// module.exports = (argv) => {
//   // const bin = resolveBin.sync('karma')
//   const input = argv._.slice(1)
//   const watch = argv.watch ? ['--auto-watch', '--no-single-run'] : []

//   return hook(argv, ['userConfig', 'hooks', 'browser', 'pre'])
//     .then(() => {
//       const obs = execao('karma', [
//         'start',
//         ...watch,
//         fromAegir('src/config/karma.conf.js'),
//         '--colors', // add supports-color
//         ...input
//       ], {
//         env: {
//           AEGIR_WEBWORKER: argv.webworker,
//           NODE_ENV: process.env.NODE_ENV || 'test'
//         },
//         localDir: path.join(__dirname, '../..')
//       })
//         .pipe(catchError(err => {
//           return throwError(Object.assign(new Error('Oops tests failed!'), {
//             cause: argv.target.length === 1 ? 'Error should be printed above.' : err.stdout
//           }))
//         }))

//       obs.subscribe({ complete: () => { hook(argv, ['userConfig', 'hooks', 'browser', 'post']) } })

//       return obs
//     })
// }

module.exports = (argv) => {
  const input = argv._.slice(1)
  const watch = argv.watch ? ['--auto-watch', '--no-single-run'] : []

  return hook(argv, ['userConfig', 'hooks', 'browser', 'pre'])
    .then(() => {
      return execa('karma', [
        'start',
        ...watch,
        fromAegir('src/config/karma.conf.js'),
        '--colors', // add supports-color
        ...input
      ], {
        env: {
          AEGIR_WEBWORKER: argv.webworker,
          NODE_ENV: process.env.NODE_ENV || 'test'
        },
        localDir: path.join(__dirname, '../..'),
        stdio: 'inherit'
      })
    })
    .then(() => hook(argv, ['userConfig', 'hooks', 'browser', 'post']))
}
