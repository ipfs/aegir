// @ts-check

/** @type {import('../../../..').PartialOptions} */
const options = {
  build: {
    config: {
      entryPoints: ['./src/index.js', './src/sw.js']
    },
    bundlesizeMax: {
      'dist/index.js': '400KB',
      'dist/sw.js': '400KB'
    }
  }
}

export default options
