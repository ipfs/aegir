'use strict'
const { fromAegir } = require('./../utils')

require('@babel/register')({
  extensions: ['.ts'],
  presets: [fromAegir('src/config/babelrc.js')]
})
