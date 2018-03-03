/* global TEST_DIR */
// This is webpack specific. It will create a single bundle out of
// `test/browser.js and all files ending in `.spec.js` within the
// `test` directory and all its subdirectories.
'use strict'

// Load test/browser.js if it exists
try {
  require(TEST_DIR + '/browser.js')
} catch (_err) {
  // Intentionally empty
}

const testsContext = require.context(TEST_DIR, true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)
