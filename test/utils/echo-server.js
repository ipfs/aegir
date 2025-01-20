/* eslint-env mocha */

import { Buffer } from 'buffer'
import { expect } from '../../utils/chai.js'
import EchoServer from '../../utils/echo-server.js'

describe('echo server spec', () => {
  const echo = new EchoServer()
  /** @type {string} */
  let url

  before(async () => {
    await echo.start()
    const { port, address } = /** @type {import('net').AddressInfo} */(echo.server.address())
    url = `http://${address}:${port}`
  })

  after(() => echo.stop())

  it('get', async () => {
    const req = await fetch(`${url}/echo`)
    expect(req.text()).to.eventually.fulfilled()
  })

  it('get with search params', async () => {
    const req = await fetch(`${url}/echo/query?${new URLSearchParams({ test: '1' })}`)
    const res = await req.text()
    expect(res).to.be.eq('{"test":"1"}')
  })

  it('get with redirect', async () => {
    const req = await fetch(`${url}/redirect?${new URLSearchParams({ to: `${url}/echo/query?test=1` })}`)
    const res = await req.text()
    expect(res).to.be.eq('{"test":"1"}')
  })

  it('post with body', async () => {
    const req = await fetch(`${url}/echo`, { method: 'post', body: '{"test":"1"}' })
    const res = await req.text()
    expect(res).to.be.eq('{"test":"1"}')
  })

  it('download endpoint with text', async () => {
    const req = await fetch(`${url}/download?${new URLSearchParams({ data: 'hello world' })}`)
    const res = await req.text()
    expect(res).to.be.eq('hello world')
  })

  it('download endpoint without data', async () => {
    const req = await fetch(`${url}/download`)
    const res = await req.text()
    expect(res).to.be.eq('')
  })

  it('download endpoint with arraybuffer', async () => {
    const req = await fetch(`${url}/download?${new URLSearchParams({ data: 'hello world' })}`)
    const res = Buffer.from(await req.arrayBuffer())
    expect(res).to.be.deep.eq(Buffer.from('hello world'))
  })

  it('get with headers', async () => {
    const req = await fetch(`${url}/echo/headers`, { headers: { foo: 'bar' } })
    const res = await req.json()
    expect(res).to.deep.include({ foo: 'bar' })
  })
})
