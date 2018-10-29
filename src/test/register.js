'use strict'
const { fromAegir } = require('./../utils')

require('@babel/register')({
  presets: [fromAegir('src/config/babelrc.js')]
})
