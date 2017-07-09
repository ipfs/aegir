/* eslint-env jest */
/* eslint-env jasmine */
'use strict'

const custom = require('./custom')

// Setup aliases to keep api consistent with mocha
global.before = beforeAll
global.after = afterAll

jasmine.DEFAULT_TIMEOUT_INTERVAL = custom.timeout

function timeout (duration) {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = duration
}

(function patchJasmine (jasmine) {
  jasmine.Suite.prototype.timeout = timeout

  const original = jasmine.Spec
  jasmine.Spec = function Spec (attr) {
    original.call(this, attr)

    const originalUserContext = this.userContext
    this.userContext = () => {
      const ctx = originalUserContext.call(this)
      ctx.timeout = timeout
      return ctx
    }
  }
  jasmine.Spec.prototype = original.prototype
  for (const statics in original) {
    if (Object.prototype.hasOwnProperty.call(original, statics)) {
      jasmine.Spec[statics] = original[statics]
    }
  }
})(global.jasmine)
