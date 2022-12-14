import herp from 'a-cjs-dep'
import derp from 'an-esm-dep'

/**
 * @typedef {import('./types').ExportedButNotInExports} ExportedButNotInExports
 */

/**
 * @typedef {object} AnExportedInterface
 * @property {() => void} AnExportedInterface.aMethod
 */

export const useHerp = () => {
  herp()
}

export const useDerp = () => {
  derp()
}
