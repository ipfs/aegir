'use strict'

const runSequence = require('run-sequence')

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
