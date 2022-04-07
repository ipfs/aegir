import {
  sortFields,
  constructManifest
} from '../utils.js'

/**
 * @param {any} manifest
 * @param {string} repoUrl
 * @param {string} [homePage]
 */
export async function monorepoManifest (manifest, repoUrl, homePage = repoUrl) {
  let proposedManifest = constructManifest(manifest, {
    private: true
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
