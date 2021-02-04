'use strict'
const { userConfig } = require('./user')

module.exports = userConfig.test.browser.config || {}
