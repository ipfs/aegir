'use strict'

const path = require('path')

module.exports = {
  tags: {
    allowUnknownTags: false,
    dictionaries: ['jsdoc']
  },
  plugins: [
    'plugins/markdown'
  ],
  opts: {
    readme: 'README.md',
    template: path.resolve(path.join(__dirname, '../jsdoc/theme')),
    encoding: 'utf8',
    destination: './docs',
    recurse: true
  },
  templates: {
    cleverLinks: true,
    url: 'https://github.com/hello-world'
  },
  packageJson: require(path.resolve('package.json'))
}
