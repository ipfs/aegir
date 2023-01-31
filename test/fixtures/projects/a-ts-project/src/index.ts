import type { EventEmitter } from 'node:events'

import herp from 'a-cjs-dep'
import derp from 'an-esm-dep'

import type { UsedButNotExported } from './a-module.js'

export const useHerp = (): void => {
  herp()
}

export const useDerp = (): void => {
  derp()
}

export interface AnExportedInterface {
  aMethod: () => void
}

export type { ExportedButNotInExports } from './a-module.js'

export interface UsesInternalType extends UsedButNotExported {

}

export interface ExtendsEmitter extends EventEmitter {

}

export enum AnEnum {
  VALUE_1 = 0,
  VALUE_2
}
