import herp from 'a-cjs-dep'
import derp from 'an-esm-dep'

export { garply } from './dir/index.js'

/**
 * @typedef {import('./types.js').ExportedButNotInExports} ExportedButNotInExports
 */

/**
 * @typedef {object} AnExportedInterface
 * @property {() => void} AnExportedInterface.aMethod
 */

export const useHerp = () => {
  // @ts-ignore this is a function
  herp()
}

export const useDerp = () => {
  derp()
}

/**
 * @type {import('./types.js').UsedButNotExported}
 */
export const usesInternalType = {
  aMethod: function () {
    throw new Error('Function not implemented')
  }
}
