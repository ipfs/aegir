'use strict'

const { createServer } = require('net')

/**
 * Helper to find an available port to put a server listening on.
 *
 * @example
 * ```js
 * const getPort = require('aegir/utils/get-port')
 * const port = await getPort(3000, '127.0.0.1')
 * // if 3000 is available returns 3000 if not returns a free port.
 *
 * ```
 *
 * @param {number} port
 * @param {string} host
 * @returns {Promise<number>}
 */
function getPort (port = 3000, host = '127.0.0.1') {
  const server = createServer()
  return new Promise((resolve, reject) => {
    server.on('error', (err) => {
      // @ts-ignore
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        server.listen(0, host)
      } else {
        reject(err)
      }
    })
    server.on('listening', () => {
      // @ts-ignore
      const { port } = server.address()
      server.close(() => resolve(port))
    })
    server.listen(port, host)
  })
}

module.exports = getPort
