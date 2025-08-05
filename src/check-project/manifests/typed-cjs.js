import { semanticReleaseConfig } from '../semantic-release-config.js'
import {
  sortFields,
  constructManifest
} from '../utils.js'

/**
 * @param {import('../index.js').ProcessManifestContext} context
 */
export async function typedCJSManifest (context) {
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
    main: 'src/index.js',
    types: 'dist/src/index.d.ts',
    typesVersions: {
      '*': {
        '*': [
          '*',
          'dist/*',
          'dist/src/*'
        ],
        'src/*': [
          '*',
          'dist/*',
          'dist/src/*'
        ]
      }
    },
    files: [
      'src',
      'dist'
    ],
    scripts,
    release
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
