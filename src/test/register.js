'use strict'
const {fromAegir} = require('./../utils')

require('@babel/register')({
  presets: [fromAegir('./../config/babelrc.js')]
})
