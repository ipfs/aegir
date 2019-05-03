'use strict'

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
      type: 'boolean',
      default: true
    },
    test: {
      describe: 'Run test tasks before release',
      type: 'boolean',
      default: true
    },
    lint: {
      describe: 'Run lint task before release',
      type: 'boolean',
      default: true
    },
    contributors: {
      describe: 'Update contributors based on the git history',
      type: 'boolean',
      default: true
    },
    bump: {
      describe: 'Bump the package version',
      type: 'boolean',
      default: true
    },
    changelog: {
      describe: 'Generate or update the CHANGELOG.md',
      type: 'boolean',
      default: true
    },
    publish: {
      describe: 'Publish to npm',
      type: 'boolean',
      default: true
    },
    ghrelease: {
      describe: 'Genereate GitHub release',
      type: 'boolean',
      default: true
    },
    docs: {
      describe: 'Generate and publish documentation',
      type: 'boolean',
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
      choices: ['major', 'minor', 'patch', 'prepatch', 'preminor', 'premajor', 'prerelease'],
      default: 'patch'
    },
    preid: {
      describe: 'The prerelease identifier',
      type: 'string'
    },
    files: {
      alias: 'f',
      describe: 'Custom globs for files to test',
      type: 'array',
      default: []
    },
    exit: {
      describe: 'force shutdown of the event loop after test run: mocha will call process.exit',
      type: 'boolean',
      default: true
    },
    'dist-tag': {
      describe: 'The npm tag to publish to',
      type: 'string'
    }
  },
  handler (argv) {
    const release = require('../src/release')
    const onError = require('../src/error-handler')
    release(argv).catch(onError)
  }
}
