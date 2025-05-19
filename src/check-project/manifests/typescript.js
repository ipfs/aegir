/* eslint-disable no-console */

import mergeOptions from '../../utils/merge-options.js'
import { semanticReleaseConfig } from '../semantic-release-config.js'
import {
  sortFields,
  sortExportsMap,
  constructManifest
} from '../utils.js'

const merge = mergeOptions.bind({ ignoreUndefined: true })

/**
 * @param {import('../index.js').ProcessManifestContext} context
 */
export async function typescriptManifest (context) {
  const { manifest, branchName, repoUrl, homePage } = context
  let release

  if (context.releaseType === 'semantic-release') {
    manifest.scripts.release = 'aegir release'
    release = semanticReleaseConfig(branchName)
  }

  if (context.releaseType === 'release-please') {
    delete manifest.scripts.release
  }

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
    release
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
    leadMaintainer: undefined,
    eslintConfig: undefined
  }

  delete proposedManifest.main

  return proposedManifest
}
