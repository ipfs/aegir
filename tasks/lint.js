'use strict'

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const path = require('path')

gulp.task('lint', () => {
  return gulp.src([
    '*.js',
    'config/**/*.js',
    'test/**/*.js',
    'src/**/*.js',
    'tasks/**/*.js'
  ])
    .pipe($.eslint(path.resolve(__dirname, '../config/eslintrc.yml')))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
})
