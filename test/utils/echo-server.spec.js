'use strict'
/* eslint-env mocha */

const http = require('ipfs-utils/src/http')
const { expect } = require('../../utils/chai')
const EchoServer = require('../../utils/echo-server')
const { format } = require('iso-url')

describe('echo server spec', () => {
  const echo = new EchoServer()
  let url

  before(async () => {
    await echo.start()
    const { port, address } = echo.server.address()
    url = format({ protocol: 'http:', hostname: address, port })
  })

  after(() => echo.stop())

  it('get', async () => {
    const req = await http.get('echo', { base: url })
    expect(req.text()).to.eventually.fulfilled()
  })

  it('get with search params', async () => {
    const req = await http.get('echo/query', { base: url, searchParams: { test: 1 } })
    const res = await req.text()
    expect(res).to.be.eq('{"test":"1"}')
  })

  it('get with redirect', async () => {
    const req = await http.get('redirect', { base: url, searchParams: { to: `${url}/echo/query?test=1` } })
    const res = await req.text()
    expect(res).to.be.eq('{"test":"1"}')
  })

  it('post with body', async () => {
    const req = await http.post('echo', { base: url, body: '{"test":"1"}' })
    const res = await req.text()
    expect(res).to.be.eq('{"test":"1"}')
  })
})
