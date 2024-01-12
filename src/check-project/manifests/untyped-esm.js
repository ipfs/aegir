import mergeOptions from '../../utils/merge-options.js'
import { semanticReleaseConfig } from '../semantic-release-config.js'
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
export async function untypedESMManifest (manifest, branchName, repoUrl, homePage = repoUrl) {
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
    release: (manifest.scripts?.release?.includes('semantic-release') || manifest.scripts?.release?.includes('aegir release')) ? semanticReleaseConfig(branchName) : undefined
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
