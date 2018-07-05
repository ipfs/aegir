'use strict'
const {hasPkgProp, browserslist} = require('./../utils')
const useBuiltinBrowserslist = !hasPkgProp('browserslist')

const validateBoolOption = (name, value, defaultValue) => {
  if (typeof value === 'undefined') {
    value = defaultValue
  }

  if (typeof value !== 'boolean') {
    throw new Error(`Preset aegir: '${name}' option must be a boolean.`)
  }

  return value
}
module.exports = function (api, opts = {}) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV
  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'
  const isEnvTest = env === 'test'
  const isFlowEnabled = validateBoolOption('flow', opts.flow, true)
  const targets = useBuiltinBrowserslist ? {
    browsers: browserslist[env]
  } : {}

  if (!isEnvDevelopment && !isEnvProduction && !isEnvTest) {
    throw new Error(
      'Using `babel-preset-aegir` requires that you specify `NODE_ENV` or ' +
          '`BABEL_ENV` environment variables. Valid values are "development", ' +
          '"test", and "production". Instead, received: ' +
          JSON.stringify(env) +
          '.'
    )
  }

  return {
    presets: [
      isEnvTest && [
        // ES features necessary for user's Node version
        require('@babel/preset-env').default,
        {
          targets: {
            node: '8.11'
          }
        }
      ],
      (isEnvProduction || isEnvDevelopment) && [
        // Latest stable ECMAScript features
        require('@babel/preset-env').default,
        {
          // `entry` transforms `@babel/polyfill` into individual requires for
          // the targeted browsers. This is safer than `usage` which performs
          // static code analysis to determine what's required.
          // This is probably a fine default to help trim down bundles when
          // end-users inevitably import '@babel/polyfill'.
          useBuiltIns: 'entry',
          modules: 'commonjs',
          targets
        }
      ]
    ].filter(Boolean),
    plugins: [
      isFlowEnabled && [require('babel-plugin-transform-flow-comments')],
      [
        require('@babel/plugin-transform-runtime').default,
        {
          helpers: false,
          polyfill: false,
          regenerator: true
        }
      ]
    ]
  }
}
