'use strict'
/* eslint-disable */
let testsContext
if (TS_ENABLED) {
  testsContext = require.context(TEST_DIR, true, /\.spec\.ts$/)
} else {
  testsContext = require.context(TEST_DIR, true, /\.spec\.js$/)
}

if (TEST_BROWSER_JS) {
  require(TEST_BROWSER_JS)
}
testsContext.keys().forEach(testsContext)
