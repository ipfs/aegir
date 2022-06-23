import { isWritableStream } from 'is-stream'

import type { PartialOptions } from '../../../../src/types';

const config: PartialOptions = {
  debug: true,
  test: {
    before: async (opts) => {
      console.log('isWritableStream: ', isWritableStream)
      return { env: { res: '4321' }  }
    }
  }
}

export default config
