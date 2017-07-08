'use strict'

const _ = require('lodash')

const utils = require('../utils')

function userConfig () {
  const config = utils.getUserConfig()

  return _.defaultsDeep({}, config, {
    webpack: {},
    karma: {},
    entry: 'src/index.js'
  })
}

module.exports = userConfig
