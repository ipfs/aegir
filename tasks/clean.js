'use strict'

module.exports = (gulp) => {
  require('./clean/node')(gulp)
  require('./clean/browser')(gulp)
}
