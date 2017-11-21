'use strict'

const release = require('../src/release')
const onError = require('../src/error-handler')

module.exports = {
  command: 'release',
  desc: 'Release your code onto the world',
  builder: {
    target: {
      alias: 't',
      describe: 'In which target environment to execute the tests',
      type: 'array',
      choices: ['node', 'browser', 'webworker'],
      default: ['node', 'browser', 'webworker']
    },
    docsFormats: {
      alias: 'd',
      describe: 'Which documentation formats to build',
      type: 'array',
      choices: ['html', 'md'],
      default: ['html']
    },
    build: {
      describe: 'Run build tasks before release',
      default: true
    },
    test: {
      describe: 'Run test tasks before release',
      default: true
    },
    lint: {
      describe: 'Run lint task before release',
      default: true
    },
    contributors: {
      describe: 'Update contributors based on the git history',
      default: true
    },
    bump: {
      describe: 'Bump the package version',
      default: true
    },
    changelog: {
      describe: 'Generate or update the CHANGELOG.md',
      default: true
    },
    publish: {
      describe: 'Publish to npm',
      default: true
    },
    ghrelease: {
      describe: 'Genereate GitHub release',
      default: true
    },
    docs: {
      describe: 'Generate and publish documentation',
      default: true
    },
    ghtoken: {
      describe: 'Access token for generating GitHub releases',
      type: 'string',
      default: ''
    },
    type: {
      describe: 'The type of version bump for this release',
      type: 'string',
      choices: ['major', 'minor', 'patch', 'prerelease'],
      default: 'patch'
    },
    files: {
      alias: 'f',
      describe: 'Custom globs for files to test',
      type: 'array',
      default: []
    },
    exit: {
      describe: 'force shutdown of the event loop after test run: mocha will call process.exit',
      default: true
    }
  },
  handler (argv) {
    release(argv).catch(onError)
  }
}
