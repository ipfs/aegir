import { semanticReleaseConfig } from '../semantic-release-config.js'
import {
  sortFields,
  constructManifest
} from '../utils.js'

/**
 * @param {import('../index.js').ProcessManifestContext} context
 */
export async function untypedCJSManifest (context) {
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
    files: [
      'src',
      'dist'
    ],
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
