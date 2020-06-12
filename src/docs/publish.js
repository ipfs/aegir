'use strict'

const ghPages = require('gh-pages')
const pify = require('pify')
const os = require('os')
const path = require('path')
const { pkg } = require('../utils')

function publish (ctx) {
  return pify(ghPages.publish.bind(ghPages))(
    'docs',
    {
      message: 'chore: update documentation',
      clone: path.join(os.tmpdir(), 'aegir-gh-pages-cache', pkg.name)
    }
  )
}

module.exports = publish
