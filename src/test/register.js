'use strict'

const path = require('path')
const here = p => path.join(__dirname, p)
require('@babel/register')({
  presets: [here('./../config/babelrc.js')]
})
