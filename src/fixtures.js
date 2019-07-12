/* global self */
'use strict'

const isNode = require('detect-node')
const path = require('path')

// note: filePath needs to be relative to the module root
module.exports = function loadFixtures (filePath, module) {
  if (isNode) {
    if (module) {
      filePath = path.join(module, filePath)
    }

    const fs = require('fs')
    const paths = [
      path.join(process.cwd(), filePath),
      path.join(process.cwd(), 'node_modules', filePath),
      resolve(filePath)
    ]

    const resourcePath = paths.find(path => fs.existsSync(path))

    if (!resourcePath) {
      throw new Error(`Could not load ${filePath}`)
    }

    return fs.readFileSync(resourcePath)
  } else {
    if (module) {
      filePath = path.join('node_modules', module, filePath)
    }

    return syncXhr(filePath)
  }
}

// @dignifiedquire: I know this is considered bad practice (syncXhr), but it
// makes testing life so much nicer!
function syncXhr (filePath) {
  const target = path.join('/base', filePath)

  const request = new self.XMLHttpRequest()
  request.open('GET', target, false)
  request.overrideMimeType('text/plain; charset=x-user-defined')
  request.send(null)

  if (request.status === 200) {
    const filestream = request.responseText
    const res = new Uint8Array(filestream.length)

    for (let i = 0; i < filestream.length; i++) {
      res[i] = filestream.charCodeAt(i) & 0xff
    }

    return Buffer.from(res)
  } else {
    throw new Error(`Could not get the Fixture: ${filePath}`)
  }
}

function resolve (filePath) {
  try {
    return require.resolve(filePath)
  } catch (error) {
    // ignore error
  }
}
