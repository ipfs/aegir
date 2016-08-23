'use strict'

module.exports = {
  plugins: [[require.resolve('babel-plugin-transform-runtime'), {
    regenerator: false
  }]],
  presets: [require.resolve('babel-preset-es2015')]
}
