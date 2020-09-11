'use strict'

module.exports = {
  command: 'generate-types [input...]',
  desc: 'Generate .d.ts files for the project',
  builder: {
    overwrite: {
      type: 'boolean',
      default: false,
      describe: 'Whether to remove all .d.ts files in the project before running',
    }
  },
  handler (argv) {
    const build = require('../src/generate-types')
    return build(argv)
  }
}
