/* global TEST_DIR, TEST_BROWSER_JS */
// This is webpack specific. It will create a single bundle out of
// `test/browser.js and all files ending in `.spec.js` within the
// `test` directory and all its subdirectories.
'use strict'

// Load test/browser.js if it exists
if (TEST_BROWSER_JS) {
  require(TEST_BROWSER_JS)
}

const testsContext = require.context(TEST_DIR, true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)
