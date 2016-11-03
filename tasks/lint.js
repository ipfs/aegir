'use strict'

module.exports = (gulp) => {
  gulp.task('lint', () => {
    const eslint = require('gulp-eslint')

    return gulp.src([
      '*.js',
      'bin/**',
      'config/**/*.js',
      'test/**/*.js',
      'src/**/*.js',
      'tasks/**/*.js',
      'examples/**/*.js',
      'benchmarks/**/*.js'
    ])
      .pipe(eslint(`${__dirname}/../config/eslintrc.yml`))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  })
}
