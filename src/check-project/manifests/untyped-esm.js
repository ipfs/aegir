import mergeOptions from '../../utils/merge-options.js'
import { semanticReleaseConfig } from '../semantic-release-config.js'
import {
  sortFields,
  constructManifest
} from '../utils.js'

const merge = mergeOptions.bind({ ignoreUndefined: true })

/**
 * @param {import('../index.js').ProcessManifestContext} context
 */
export async function untypedESMManifest (context) {
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
    files: [
      'src',
      'dist',
      '!dist/test',
      '!**/*.tsbuildinfo'
    ],
    exports: {
      '.': {
        types: './dist/src/index.d.ts',
        import: './src/index.js'
      }
    },
    eslintConfig: merge({
      extends: 'ipfs',
      parserOptions: {
        project: true,
        sourceType: 'module'
      }
    }, manifest.eslintConfig),
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
    leadMaintainer: undefined
  }

  return proposedManifest
}
