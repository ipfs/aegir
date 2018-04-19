const path = require('path')

module.exports = {
  entry: './cli_patched.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'aegir'
  }
}
