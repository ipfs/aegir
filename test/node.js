/* eslint-env mocha */
'use strict'

describe('Aegir node tests', () => {
  require('./fixtures')
  require('./lint-commits')
  require('./lint')
  require('./test')
  require('./utils')
  require('./fixtures/resolve-test/project-dir/fixtures')
})
