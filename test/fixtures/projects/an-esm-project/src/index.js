import herp from 'a-cjs-dep'
import derp from 'an-esm-dep'

/**
 * @typedef {import('./types').AnExportedInterface} AnExportedInterface
 */

export const useHerp = () => {
  herp()
}

export const useDerp = () => {
  derp()
}
