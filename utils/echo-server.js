'use strict'

const send = require('@polka/send-type')
const polka = require('polka')
const cors = require('cors')
const http = require('http')
const { Buffer } = require('buffer')
const stringify = require('json-stringify-safe')
const getPort = require('./get-port')
const toBuffer = require('it-to-buffer')

class EchoServer {
  constructor (options = {}) {
    this.options = options
    this.port = options.port || 3000
    this.host = options.host || '127.0.0.1'
    this.started = false
  }

  async start () {
    if (!this.started) {
      if (this.options.findPort !== false) {
        this.port = await getPort(this.port)
      }
      this.server = http.createServer()
      this.polka = polka({ server: this.server })
        .use(cors())
        .use('/redirect', (req, res) => {
          send(res, 302, null, { Location: req.query.to })
        })
        .all('/echo/query', (req, res) => {
          send(res, 200, req.query)
        })
        .all('/echo', async (req, res) => {
          // try to echo the body back to the sender
          const contentType = req.headers['content-type']

          if (contentType) {
            req.body = await toBuffer(req)

            if (contentType.includes('text/plain')) {
              req.body = req.body.toString('utf8')
            } else if (contentType.includes('application/json')) {
              req.body = JSON.parse(req.body)
            }
          }

          send(res, 200, stringify(req))
        })
        .all('/download', (req, res) => {
          send(res, 200, Buffer.from(req.query.data || ''))
        })

      const listen = new Promise((resolve, reject) => {
        this.server.once('error', reject)
        this.polka.listen({ host: this.host, port: this.port }, () => {
          resolve()
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
          err ? reject(err) : resolve()
        })
      })
      await stop
      this.started = false
    }
    return this
  }
}

module.exports = EchoServer
