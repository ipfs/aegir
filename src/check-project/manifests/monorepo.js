import { semanticReleaseConfig } from '../semantic-release-config.js'
import {
  sortFields,
  constructManifest
} from '../utils.js'

/**
 * @param {any} manifest
 * @param {string} repoUrl
 * @param {string} homePage
 * @param {string} branchName
 */
export async function monorepoManifest (manifest, repoUrl, homePage, branchName) {
  let proposedManifest = constructManifest(manifest, {
    private: true,
    release: (
      Object.values(manifest.scripts ?? {})
        .some(script => script.includes('semantic-release') || script.includes('aegir release'))
    )
      ? semanticReleaseConfig(branchName)
      : undefined
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
