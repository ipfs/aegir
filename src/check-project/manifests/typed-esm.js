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
export async function typedESMManifest (context) {
  const { manifest, branchName, repoUrl, homePage } = context
  let release
  const scripts = {
    ...manifest.scripts
  }

  if (context.releaseType === 'semantic-release') {
    scripts.release = 'aegir release'
    release = semanticReleaseConfig(branchName)
  }

  if (context.releaseType === 'release-please') {
    delete scripts.release
  }

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
    exports: sortExportsMap(
      merge({
        '.': {
          types: './dist/src/index.d.ts',
          import: './src/index.js'
        }
      }, manifest.exports)
    ),
    release,
    scripts
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
    leadMaintainer: undefined,
    eslintConfig: undefined
  }

  return proposedManifest
}
