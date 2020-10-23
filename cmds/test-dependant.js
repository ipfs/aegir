'use strict'

module.exports = {
  command: 'test-dependant [repo]',
  desc: 'Run the tests of an module that depends on this module to see if the current changes have caused a regression',
  builder: {
    repo: {
      describe: 'The dependant module\'s repo URL',
      type: 'string'
    },
    branch: {
      describe: 'A branch to use from the dependant repo',
      type: 'string'
    },
    moduleName: {
      describe: 'A branch to use from the dependant repo',
      type: 'string'
    },
    deps: {
      describe: 'Other dependencies to override, e.g. --deps=foo@1.5.0,bar@2.4.1',
      coerce: (val) => {
        if (typeof val !== 'string') {
          return {}
        }

        const deps = {}

        for (const dep of val.split(',')) {
          const parts = dep.split('@')
          deps[parts[0]] = parts[1]
        }

        return deps
      },
      default: {}
    }
  },
  handler (argv) {
    const cmd = require('../src/test-dependant')
    const onError = require('../src/error-handler')
    cmd(argv).catch(onError)
  }
}
