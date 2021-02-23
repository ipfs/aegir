'use strict'

// @ts-ignore
const send = require('@polka/send-type')
const polka = require('polka')
const cors = require('cors')
const http = require('http')
const { Buffer } = require('buffer')
const getPort = require('./get-port')

/**
 * HTTP echo server for testing purposes.
 *
 * @example
 * ```js
 * const EchoServer = require('aegir/utils/echo-server')
 * const server = new EchoServer()
 * await server.start()
 *
 * // search params echo endpoint
 * const req = await fetch('http://127.0.0.1:3000/echo/query?test=one')
 * console.log(await req.text())
 *
 * // body echo endpoint
 * const req = await fetch('http://127.0.0.1:3000/echo', {
 *   method: 'POST',
 *   body: '{"key": "value"}'
 * })
 * console.log(await req.text())
 *
 * // redirect endpoint
 * const req = await fetch('http://127.0.0.1:3000/redirect?to=http://127.0.0.1:3000/echo')
 * console.log(await req.text())
 *
 * // download endpoint
 * const req = await fetch('http://127.0.0.1:3000/download?data=helloWorld')
 * console.log(await req.text())
 *
 * await server.stop()
 * ```
 */
class EchoServer {
  /**
   *
   * @param {Object} options - server options
   * @param {number} [options.port] - server port
   * @param {string} [options.host] - server host
   * @param {boolean} [options.findPort] - flag to check for ports
   */
  constructor (options = {}) {
    this.options = options
    this.port = options.port || 3000
    this.host = options.host || '127.0.0.1'
    this.started = false
    this.server = http.createServer()
    this.polka = polka({ server: this.server })
  }

  async start () {
    if (!this.started) {
      if (this.options.findPort !== false) {
        this.port = await getPort(this.port)
      }
      this.polka.use(cors())
      this.polka.use('/redirect', (req, res) => {
        send(res, 302, null, { Location: req.query.to })
      })
      this.polka.all('/echo/query', (req, res) => {
        send(res, 200, req.query)
      })
      this.polka.all('/echo/headers', (req, res) => {
        send(res, 200, req.headers)
      })
      this.polka.all('/echo', (req, res) => {
        send(res, 200, req)
      })
      this.polka.all('/download', (req, res) => {
        // @ts-ignore
        send(res, 200, Buffer.from(req.query.data || ''))
      })

      const listen = new Promise((resolve, reject) => {
        this.server.once('error', reject)
        this.polka.listen({ host: this.host, port: this.port }, () => {
          resolve(true)
        })
      })
      await listen
      this.started = true
    }
    return this
  }

  async stop () {
    if (this.started) {
      const stop = new Promise((resolve, reject) => {
        this.server.once('error', reject)
        this.server.close((err) => {
          err ? reject(err) : resolve(true)
        })
      })
      await stop
      this.started = false
    }
    return this
  }
}

module.exports = EchoServer
