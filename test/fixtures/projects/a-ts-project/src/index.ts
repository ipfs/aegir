import herp from 'a-cjs-dep'
import derp from 'an-esm-dep'
import type { UsedButNotExported } from './a-module.js'

export const useHerp = () => {
  herp()
}

export const useDerp = () => {
  derp()
}

export interface AnExportedInterface {
  aMethod: () => void
}

export type { ExportedButNotInExports } from './a-module.js'

export interface UsesInternalType extends UsedButNotExported {

}
