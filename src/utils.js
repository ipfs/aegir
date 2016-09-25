'use strict'

const runSequence = require('run-sequence')
const util = require('gulp-util')

// Workaround gulp not exiting if there are some
// resources not freed
exports.exitOnFail = (done) => (err) => {
  if (err) {
    process.exit(1)
  } else {
    done()
  }
}

exports.hooksRun = (gulp, name, tasks, done) => {
  const beforeTask = name + ':before'
  const afterTask = name + ':after'

  if (gulp.tasks[beforeTask]) {
    tasks.unshift(beforeTask)
  }

  if (gulp.tasks[afterTask]) {
    tasks.push(afterTask)
  }

  tasks.push(done)

  runSequence.use(gulp).apply(null, tasks)
}

exports.fail = (msg) => {
  util.log(util.colors.red(msg))
  process.exit(1)
}

exports.getVersion = () => {
  return JSON.parse(
    require('fs').readFileSync('./package.json', 'utf8')
  ).version
}
