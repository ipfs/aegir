'use strict'

module.exports = (gulp) => {
  require('./clean/browser')(gulp)
  require('./clean/docs')(gulp)
}
