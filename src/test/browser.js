'use strict'

const Server = require('karma').Server
const getConfig = require('./browser-config')

const IS_SAUCE = process.env.SAUCE_USERNAME && process.env.TRAVIS

function testBrowser (isWebworker) {
  return (ctx) => new Promise((resolve, reject) => {
    const config = getConfig(isWebworker, ctx)

    const server = new Server(config, (exitCode) => {
      if (exitCode > 0 && !IS_SAUCE) {
        reject(new Error('Some tests are failing'))
      }
      resolve()
    })

    server.start()
  })
}

module.exports = {
  default: testBrowser(false),
  webworker: testBrowser(true)
}
