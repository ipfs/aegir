'use strict'

const isNode = require('detect-node')
const path = require('path')

module.exports = function loadFixtures (dirname, file, module) {
  if (isNode) {
    return require('fs').readFileSync(path.join(dirname, file))
  } else {
    return syncXhr(file, module)
  }
}

// I know this is considered bad practice, but it makes testing life so much nicer!
function syncXhr (url, module) {
  let target
  if (module) {
    target = path.join('base', 'node_modules', module, 'test', url)
  } else {
    target = path.join('base', 'test', url)
  }
  const request = new window.XMLHttpRequest()
  request.open('GET', target, false)
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
