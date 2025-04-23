import {
  sortFields,
  constructManifest
} from '../utils.js'

/**
 * @param {import('../index.js').ProcessManifestContext} context
 */
export async function monorepoManifest (context) {
  const { manifest, repoUrl, homePage } = context

  const scripts = {
    ...manifest.scripts
  }

  const devDependencies = manifest.devDependencies ?? {}

  if (context.releaseType === 'semantic-release') {
    scripts.release = 'run-s build npm:release docs'
    scripts['npm:release'] = 'aegir run release'
    scripts.docs = 'aegir docs'

    delete manifest.release
    devDependencies['npm-run-all'] = '^4.1.5'
  }

  if (context.releaseType === 'release-please') {
    scripts.release = 'run-s build npm:release docs'
    scripts['npm:release'] = 'aegir exec --bail false npm -- publish'
    scripts['release:rc'] = 'aegir release-rc'
    scripts.docs = 'aegir docs'

    devDependencies['npm-run-all'] = '^4.1.5'
  }

  let proposedManifest = constructManifest(manifest, {
    private: true,
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
