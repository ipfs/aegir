const path = require('path')

let alias = {
  'path-platform': require.resolve('./tmp/path_patched')
}

'electron hipchat-notifier loggly mailgun-js nodemailer should sinon-restore slack-node yamlparser'.split(' ').map(thing => {
  alias[thing] = require.resolve('./tmp/lazyload.' + thing)
})

module.exports = {
  resolve: {
    alias
  },
  entry: './cli_patched.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'aegir'
  }
}
