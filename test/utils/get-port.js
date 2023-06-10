/* eslint-env mocha */

import { expect } from '../../utils/chai.js'
import EchoServer from '../../utils/echo-server.js'
import getPort from '../../utils/get-port.js'

describe('get port spec', () => {
  it('should find the given port if available', async () => {
    const port = await getPort(4000)
    expect(port).to.be.eq(4000)
  })

  it('should find an available port', async () => {
    const echo = new EchoServer({ port: 3000 })
    await echo.start()
    const port = await getPort(3000)
    expect(port).to.not.be.eq(3000)
    try {
      const echo2 = new EchoServer({ port, findPort: false })
      await echo2.start()
      await echo2.stop()
    } catch (err) {
      expect(err).to.not.exist()
    }
    await echo.stop()
  })
})
