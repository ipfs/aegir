/* global self */
'use strict'

const isNode = require('detect-node')
const path = require('path')

module.exports = function loadFixtures (filePath, module) {
  // note: filePath needs to be relative to the module root
  if (module) {
    filePath = path.join('node_modules', module, filePath)
  }

  if (isNode) {
    return require('fs').readFileSync(path.join(process.cwd(), filePath))
  } else {
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
    let res = new Uint8Array(filestream.length)

    for (let i = 0; i < filestream.length; i++) {
      res[i] = filestream.charCodeAt(i) & 0xff
    }

    return Buffer.from(res)
  } else {
    throw new Error('Could not get the Fixture')
  }
}
