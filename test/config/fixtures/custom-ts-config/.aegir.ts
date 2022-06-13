import type { PartialOptions } from '../../../../src/types';

const config: PartialOptions = {
  debug: true,
  test: {
    before: async (opts) => {
      return { env: { res: '1234' }  }
    }
  }
}

export default config
