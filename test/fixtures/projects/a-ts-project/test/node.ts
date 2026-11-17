/* eslint-disable @typescript-eslint/no-namespace */

// enums and namespaces with values cannot be stripped, they need transforming,
// which Node.js 26 no longer does by itself

enum Direction {
  Up = 'UP',
  Down = 'DOWN'
}

namespace Direction {
  export const opposite = (direction: Direction): Direction => {
    return direction === Direction.Up ? Direction.Down : Direction.Up
  }
}

describe('transform', () => {
  it('runs code that needs transforming', () => {
    if (Direction.opposite(Direction.Up) !== Direction.Down) {
      throw new Error('enum or namespace was not transformed correctly')
    }
  })
})
