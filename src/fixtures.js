/* global self */
'use strict'

const isNode = require('detect-node')
const path = require('path')

module.exports = function loadFixtures (dirname, filePath, module) {
  if (isNode) {
    return require('fs').readFileSync(path.join(dirname, filePath))
  } else {
    return syncXhr(filePath, module)
  }
}

// @dignifiedquire: I know this is considered bad practice, but it makes testing life so much nicer!
function syncXhr (filePath, module) {
  let target
  if (module) {
    target = path.join('/base', 'node_modules', module, filePath)
    console.log('module is', module)
    console.log('filePath is', filePath)
    console.log('target is', target)
  } else {
    target = path.join('/base', filePath)
  }

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
  }
}
