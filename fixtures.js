'use strict'

const isNode = require('detect-node')
const path = require('path')

module.exports = function loadFixtures (dirname, file) {
  if (isNode) {
    return require('fs').readFileSync(path.join(dirname, file))
  } else {
    return syncXhr(file)
  }
}

// I know this is considered bad practice, but it makes testing life so much nicer!
function syncXhr (url) {
  const request = new window.XMLHttpRequest()
  request.open('GET', path.join('base', 'test', url), false)
  request.overrideMimeType('text/plain; charset=x-user-defined')
  request.send(null)

  if (request.status === 200) {
    const filestream = request.responseText
    let res = new Uint8Array(filestream.length)

    for (let i = 0; i < filestream.length; i++) {
      res[i] = filestream.charCodeAt(i) & 0xff
    }

    return new Buffer(res)
  }
}
