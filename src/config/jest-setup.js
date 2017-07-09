/* eslint-env jest */
/* eslint-env jasmine */
'use strict'

const custom = require('./custom')

// Setup aliases to keep api consistent with mocha
global.before = beforeAll
global.after = afterAll

jasmine.DEFAULT_TIMEOUT_INTERVAL = custom.timeout
