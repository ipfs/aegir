'use strict'

const ghPages = require('gh-pages')
const pify = require('pify')
const os = require('os')
const path = require('path')

const utils = require('../utils')

function publish (ctx) {
  return utils.getPkg().then((pkg) => {
    return pify(ghPages.publish.bind(ghPages))('docs', {
      message: 'chore: update documentation',
      clone: path.join(os.tmpdir(), 'aegir-gh-pages-cache', pkg.name)
    })
  })
}

module.exports = publish
