/**
 * @param {string} branchName
 */
export const semanticReleaseConfig = (branchName) => {
  return {
    branches: [
      branchName
    ],
    plugins: [
      [
        '@semantic-release/commit-analyzer', {
          preset: 'conventionalcommits',
          releaseRules: [{
            breaking: true,
            release: 'major'
          }, {
            revert: true,
            release: 'patch'
          }, {
            type: 'feat',
            release: 'minor'
          }, {
            type: 'fix',
            release: 'patch'
          }, {
            type: 'docs',
            release: 'patch'
          }, {
            type: 'test',
            release: 'patch'
          }, {
            type: 'deps',
            release: 'patch'
          }, {
            scope: 'no-release',
            release: false
          }]
        }
      ],
      [
        '@semantic-release/release-notes-generator', {
          preset: 'conventionalcommits',
          presetConfig: {
            types: [{
              type: 'feat',
              section: 'Features'
            }, {
              type: 'fix',
              section: 'Bug Fixes'
            }, {
              type: 'chore',
              section: 'Trivial Changes'
            }, {
              type: 'docs',
              section: 'Documentation'
            }, {
              type: 'deps',
              section: 'Dependencies'
            }, {
              type: 'test',
              section: 'Tests'
            }]
          }
        }
      ],
      '@semantic-release/changelog',
      '@semantic-release/npm',
      '@semantic-release/github',
      ['@semantic-release/git', {
        assets: ['CHANGELOG.md', 'package.json']
      }]
    ]
  }
}
