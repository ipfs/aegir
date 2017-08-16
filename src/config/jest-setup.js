/* eslint-env jest */
/* eslint-env jasmine */
'use strict'

// Setup aliases to keep api consistent with mocha
global.before = beforeAll
global.after = afterAll

jasmine.DEFAULT_TIMEOUT_INTERVAL = global.DEFAULT_TIMEOUT

function timeout (duration) {
  let done = false
  let original = jasmine.DEFAULT_TIMEOUT_INTERVAL

  Object.defineProperty(jasmine, 'DEFAULT_TIMEOUT_INTERVAL', {
    get () {
      if (done) {
        return original
      }
      done = true
      return duration
    }
  })
}

(function patchJasmine (jasmine) {
  jasmine.Suite.prototype.timeout = timeout

  // patch spec
  const originalSpec = jasmine.Spec
  jasmine.Spec = function Spec (attr) {
    originalSpec.call(this, attr)

    const originalUserContext = this.userContext
    this.userContext = () => {
      const ctx = originalUserContext.call(this)
      ctx.timeout = timeout
      return ctx
    }
  }
  jasmine.Spec.prototype = originalSpec.prototype
  for (const statics in originalSpec) {
    if (Object.prototype.hasOwnProperty.call(originalSpec, statics)) {
      jasmine.Spec[statics] = originalSpec[statics]
    }
  }

  // patch suite
  const originalSuite = jasmine.Suite
  jasmine.Suite = function Suite (attr) {
    originalSuite.call(this, attr)

    this.sharedContext = Object.assign(this.sharedContext || {}, {
      timeout
    })
  }
  jasmine.Suite.prototype = originalSuite.prototype
  for (const statics in originalSuite) {
    if (Object.prototype.hasOwnProperty.call(originalSuite, statics)) {
      jasmine.Suite[statics] = originalSuite[statics]
    }
  }
})(global.jasmine)
