'use strict'
const { hasPkgProp, browserslist } = require('./../utils')
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
  const isFlowEnabled = validateBoolOption('flow', opts.flow, true)
  const targets = useBuiltinBrowserslist ? { browsers: browserslist } : {}

  return {
    presets: [
      [
        require('@babel/preset-env').default,
        {
          useBuiltIns: 'entry',
          modules: 'commonjs',
          targets
        }
      ]
    ],
    plugins: [
      isFlowEnabled && [require('babel-plugin-transform-flow-comments')],
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
