/* eslint-env mocha */
import { useHerp, useDerp } from '../src/index.js'

describe('esm test', () => {
  it('runs an esm test', () => {
    useHerp()
    useDerp()
  })
})
