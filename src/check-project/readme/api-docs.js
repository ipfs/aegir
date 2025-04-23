/**
 * @param {*} pkg
 * @param {*} [parentManifest]
 */
export const API_DOCS = (pkg, parentManifest) => {
  // test for docs script in monorepo root or package
  const scripts = parentManifest?.scripts ?? pkg.scripts ?? {}

  if (scripts.docs == null) {
    return ''
  }

  const ghPages = parseGhPagesUrl(pkg, parentManifest)

  return `
# API Docs

* [${ghPages}](${ghPages})
`
}

/**
 * Use the homepage field of the package.json to derive the GH pages
 * url for the documentation website.
 *
 * @param {*} pkg
 * @param {*} [parentManifest]
 * @returns {string}
 */
function parseGhPagesUrl (pkg, parentManifest) {
  try {
    // find gh-pages url
    const homepage = new URL(pkg.homepage)
    const [orgName, moduleName] = homepage.pathname.split('/').filter(Boolean)

    let ghPages = `https://${orgName}.github.io/${moduleName}`

    if (parentManifest != null) {
      // we are a submodule of a monorepo so link directly to the module page
      ghPages += `/modules/${pkg.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`
    }

    return ghPages
  } catch (/** @type {any} **/ err) {
    throw new Error(`Could not detect gh-pages url - does the package.json have a valid homepage key? - ${err.stack}`)
  }
}
