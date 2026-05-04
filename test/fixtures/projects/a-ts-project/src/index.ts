import herp from 'a-cjs-dep'
import derp from 'an-esm-dep'
import type { UsedButNotExported } from './a-module.ts'
import type { EventEmitter } from 'node:events'

export { garply } from './dir/index.ts'

export const useHerp = (): void => {
  // @ts-ignore this is a function
  herp()
}

export const useDerp = (): void => {
  derp()
}

export interface AnExportedInterface {
  aMethod(): void
}

export type { ExportedButNotInExports } from './a-module.ts'

export interface UsesInternalType extends UsedButNotExported {

}

export interface ExtendsEmitter extends EventEmitter {

}

export enum AnEnum {
  VALUE_1 = 0,
  VALUE_2
}
