'use strict'
const { fromAegir } = require('../utils')
module.exports = {
  overrides: [
    {
      files: [
        '**/*.js'
      ],
      extends: fromAegir('src/config/eslintrc-js.js')
    },
    {
      files: [
        '**/*.ts'
      ],
      extends: fromAegir('src/config/eslintrc-ts.js')
    }
  ]
}
