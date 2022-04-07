import { semanticReleaseConfig } from '../semantic-release-config.js'
import mergeOptions from 'merge-options'
import {
  sortFields,
  constructManifest
} from '../utils.js'

const merge = mergeOptions.bind({ ignoreUndefined: true })

/**
 * @param {any} manifest
 * @param {string} branchName
 * @param {string} repoUrl
 * @param {string} [homePage]
 */
export async function typedESMManifest (manifest, branchName, repoUrl, homePage = repoUrl) {
  let proposedManifest = constructManifest(manifest, {
    type: 'module',
    types: './dist/src/index.d.ts',
    typesVersions: {
      '*': {
        '*': [
          '*',
          'dist/*',
          'dist/src/*',
          'dist/src/*/index'
        ],
        'src/*': [
          '*',
          'dist/*',
          'dist/src/*',
          'dist/src/*/index'
        ]
      }
    },
    files: [
      'src',
      'dist',
      '!dist/test',
      '!**/*.tsbuildinfo'
    ],
    exports: sortFields(
      merge({
        '.': {
          import: './src/index.js'
        }
      }, manifest.exports)
    ),
    eslintConfig: merge({
      extends: 'ipfs',
      parserOptions: {
        sourceType: 'module'
      }
    }, manifest.eslintConfig),
    release: manifest.scripts?.release?.includes('semantic-release') || manifest.scripts?.release?.includes('aegir release') ? semanticReleaseConfig(branchName) : undefined
  }, repoUrl, homePage)

  const rest = {
    ...sortFields(manifest)
  }

  for (const key of Object.keys(proposedManifest)) {
    delete rest[key]
  }

  proposedManifest = {
    ...proposedManifest,
    ...rest,
    contributors: undefined,
    leadMaintainer: undefined
  }

  return proposedManifest
}
