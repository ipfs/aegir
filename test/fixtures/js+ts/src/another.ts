import { main as some } from './some.js'
import { hello } from './typed.ts'

some()

export const main = (): void => {
  hello('world')
}
