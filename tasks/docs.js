'use strict'

module.exports = (gulp) => {
  require('./clean')(gulp)
  require('./docs/build')(gulp)
  require('./docs/publish')(gulp)
}
