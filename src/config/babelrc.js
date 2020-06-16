'use strict'
const { pkg, browserslist } = require('./../utils')

module.exports = function (opts = {}) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV
  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'
  const isEnvTest = env === 'test'
  const targets = { browsers: pkg.browserslist || browserslist }

  if (!isEnvDevelopment && !isEnvProduction && !isEnvTest) {
    throw new Error(
      'Using `babel-preset-env` requires that you specify `NODE_ENV` or ' +
          '`BABEL_ENV` environment variables. Valid values are "development", ' +
          '"test", and "production". Instead, received: ' +
          JSON.stringify(env) +
          '.'
    )
  }

  return {
    presets: [
      [
        require('@babel/preset-env').default,
        {
          corejs: 3,
          useBuiltIns: 'entry',
          modules: 'commonjs',
          bugfixes: true,
          targets
        }
      ]
    ].filter(Boolean),
    plugins: [
      [
        require('@babel/plugin-transform-runtime').default,
        {
          helpers: false,
          regenerator: true
        }
      ]
    ]
  }
}
