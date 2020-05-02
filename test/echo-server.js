/* eslint-env mocha */
'use strict'

const { expect } = require('../utils/chai')
const { format } = require('iso-url')
const fetch = require('node-fetch')
const EchoServer = require('../utils/echo-server')

describe('echo-server', function () {
  let echo
  let echoServerUrl

  beforeEach(async () => {
    echo = new EchoServer()

    const server = await echo.start()
    const { address, port } = server.server.address()

    echoServerUrl = format({ protocol: 'http:', hostname: address, port })
  })

  afterEach(async () => {
    await echo.stop()
  })

  it('should echo request', async () => {
    const req = await fetch(`${echoServerUrl}/echo?foo=bar`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json+sent-by-test'
      },
      body: JSON.stringify({
        foo: 'bar'
      })
    })

    const rsp = JSON.parse(await req.text())
    expect(rsp).to.have.nested.property('headers.content-type', 'application/json+sent-by-test')
    expect(rsp).to.have.nested.property('body.foo', 'bar')
    expect(rsp).to.have.nested.property('query.foo', 'bar')
  })

  it('should redirect request', async () => {
    const req = await fetch(`${echoServerUrl}/redirect?to=bar`, {
      redirect: 'manual'
    })

    expect(req).to.have.property('status', 302)
    expect(req.headers.get('location')).to.equal(`${echoServerUrl}/bar`)
  })

  it('should redirect request to external url', async () => {
    const req = await fetch(`${echoServerUrl}/redirect?to=http://example.com/blah`, {
      redirect: 'manual'
    })

    expect(req).to.have.property('status', 302)
    expect(req.headers.get('location')).to.equal('http://example.com/blah')
  })

  it('should download data', async () => {
    const req = await fetch(`${echoServerUrl}/download?data=hello`)

    const rsp = await req.text()
    expect(rsp).to.equal('hello')
  })
})
