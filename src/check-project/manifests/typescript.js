/* eslint-disable no-console */

import mergeOptions from 'merge-options'
import { semanticReleaseConfig } from '../semantic-release-config.js'
import {
  sortFields,
  sortExportsMap,
  constructManifest
} from '../utils.js'

const merge = mergeOptions.bind({ ignoreUndefined: true })

/**
 * @param {any} manifest
 * @param {string} branchName
 * @param {string} repoUrl
 * @param {string} [homePage]
 */
export async function typescriptManifest (manifest, branchName, repoUrl, homePage = repoUrl) {
  let proposedManifest = constructManifest(manifest, {
    type: 'module',
    types: './dist/src/index.d.ts',
    typesVersions: undefined,
    files: [
      'src',
      'dist',
      '!dist/test',
      '!**/*.tsbuildinfo'
    ],
    exports: sortExportsMap(
      merge({
        '.': {
          types: './dist/src/index.d.ts',
          import: './dist/src/index.js'
        }
      }, manifest.exports)
    ),
    eslintConfig: merge({
      extends: 'ipfs',
      parserOptions: {
        project: true,
        sourceType: 'module'
      }
    }, manifest.eslintConfig),
    release: (manifest.scripts?.release?.includes('semantic-release') || manifest.scripts?.release?.includes('aegir release')) ? semanticReleaseConfig(branchName) : undefined
  }, repoUrl, homePage)

  if (proposedManifest.exports != null && Object.keys(proposedManifest.exports).length > 1) {
    console.info('Multiple exports detected')

    proposedManifest.typesVersions = {
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
    }
  }

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

  delete proposedManifest.main

  return proposedManifest
}
