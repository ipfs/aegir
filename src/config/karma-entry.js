'use strict'
/* eslint-disable */
const testsContext = require.context(TEST_DIR, true, /\.spec\.js$/)

if (TEST_BROWSER_JS) {
  require(TEST_BROWSER_JS)
}
testsContext.keys().forEach(testsContext)
