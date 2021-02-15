'use strict'

const { userConfig } = require('../src/config/user')

module.exports = {
  command: 'release',
  desc: 'Release your code onto the world',
  builder: {
    build: {
      describe: 'Run build tasks before release',
      type: 'boolean',
      default: userConfig.release.build
    },
    test: {
      describe: 'Run test tasks before release',
      type: 'boolean',
      default: userConfig.release.test
    },
    lint: {
      describe: 'Run lint task before release',
      type: 'boolean',
      default: userConfig.release.lint
    },
    contributors: {
      describe: 'Update contributors based on the git history',
      type: 'boolean',
      default: userConfig.release.contributors
    },
    bump: {
      describe: 'Bump the package version',
      type: 'boolean',
      default: userConfig.release.bump
    },
    changelog: {
      describe: 'Generate or update the CHANGELOG.md',
      type: 'boolean',
      default: userConfig.release.changelog
    },
    publish: {
      describe: 'Publish to npm',
      type: 'boolean',
      default: userConfig.release.publish
    },
    commit: {
      describe: 'Commit changes to git',
      type: 'boolean',
      default: userConfig.release.commit
    },
    tag: {
      describe: 'Create release tag in git',
      type: 'boolean',
      default: userConfig.release.tag
    },
    push: {
      describe: 'Push changes to GitHub',
      type: 'boolean',
      default: userConfig.release.push
    },
    ghrelease: {
      describe: 'Generate GitHub release',
      type: 'boolean',
      default: userConfig.release.ghrelease
    },
    docs: {
      describe: 'Generate and publish documentation',
      type: 'boolean',
      default: userConfig.release.docs
    },
    ghtoken: {
      describe: 'Access token for generating GitHub releases',
      type: 'string',
      default: userConfig.release.ghtoken
    },
    type: {
      describe: 'The type of version bump for this release',
      type: 'string',
      choices: ['major', 'minor', 'patch', 'prepatch', 'preminor', 'premajor', 'prerelease'],
      default: userConfig.release.type
    },
    preid: {
      describe: 'The prerelease identifier',
      type: 'string',
      default: userConfig.release.preid
    },
    'dist-tag': {
      describe: 'The npm tag to publish to',
      type: 'string',
      default: userConfig.release.distTag
    },
    remote: {
      describe: 'Git remote',
      type: 'string',
      default: userConfig.release.remote
    }
  },
  handler (argv) {
    const release = require('../src/release')
    return release(argv)
  }
}
