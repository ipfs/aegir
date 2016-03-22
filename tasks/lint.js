'use strict'

const $ = require('gulp-load-plugins')()
const path = require('path')

module.exports = (gulp, done) => {
  return gulp.src([
    '*.js',
    'bin/**',
    'config/**/*.js',
    'test/**/*.js',
    'src/**/*.js',
    'tasks/**/*.js'
  ])
    .pipe($.eslint(path.resolve(__dirname, '../config/eslintrc.yml')))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
}
