'use strict'
const { fromAegir } = require('../utils')
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    fromAegir('src/config/eslintrc.js'),
    'plugin:@typescript-eslint/recommended'
  ]
}
