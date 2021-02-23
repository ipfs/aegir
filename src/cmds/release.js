'use strict'

const { userConfig } = require('../config/user')
/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 */

const EPILOG = `
Performing a release involves creating new commits and tags and then pushing them back to the repository you are releasing from. In order to do this you should create a [GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) and store it in the environmental variable "AEGIR_GHTOKEN".   

The only access scope it needs is "public_repo".

Be aware that by storing it in "~/.profile" or similar you will make it available to any program that runs on your computer.
`
module.exports = {
  command: 'release',
  desc: 'Release your code onto the world',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .example('aegir release --type major', 'Major release')
      .example('aegir release --type premajor --preid rc --dist-tag next', 'Major prerelease (1.0.0 -> 2.0.0-rc.0)')
      .example('aegir release --type prerelease --preid rc --dist-tag next', 'Increment prerelease (2.0.0-rc.0 -> 2.0.0-rc.1)')
      .options(
        {
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
          types: {
            describe: 'Run type check task before release',
            type: 'boolean',
            default: userConfig.release.types
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
        }
      )
  },
  /**
   * @param {import("../types").GlobalOptions & import("../types").ReleaseOptions} argv
   */
  handler (argv) {
    const release = require('../release')
    return release(argv)
  }
}
