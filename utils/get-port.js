'use strict'

const { createServer } = require('net')

function getPort (port = 3000, host = '127.0.0.1') {
  const server = createServer()
  return new Promise((resolve, reject) => {
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        server.listen(0, host)
      } else {
        reject(err)
      }
    })
    server.on('listening', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
    server.listen(port, host)
  })
}

module.exports = getPort
