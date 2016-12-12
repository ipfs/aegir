'use strict'

const path = require('path')

let sourceDirectories = [
  '*.js',
  'bin/**',
  'config/**/*.js',
  'test/**/*.js',
  'src/**/*.js',
  'tasks/**/*.js',
  'examples/**/*.js',
  'benchmarks/**/*.js',
  '!**/node_modules/**'
]

// Get custom entry file's directory and add it to the source directories
try {
  const customConfig = require(path.resolve('.aegir.js'))
  if (customConfig.entry) {
    // Get the entry file path and remove the filename from it
    const entryDir = customConfig.entry.split('/').slice(0, -1).join('/')
    if (entryDir !== '') {
      sourceDirectories.push(entryDir + '/**/*.js')
    }
  }
} catch (err) {
}

module.exports = (gulp) => {
  gulp.task('lint', () => {
    const eslint = require('gulp-eslint')

    return gulp.src(sourceDirectories)
      .pipe(eslint(`${__dirname}/../config/eslintrc.yml`))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  })
}
