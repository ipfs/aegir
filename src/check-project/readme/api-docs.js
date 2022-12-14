/**
 * @param {*} pkg
 */
export const APIDOCS = (pkg) => {
  if (pkg.scripts.docs == null) {
    return ''
  }

  const ghPages = parseGhPagesUrl(pkg)

  return `
## API Docs

* [${ghPages}](${ghPages})
`
}

/**
 * Use the homepage field of the package.json to derive the GH pages
 * url for the documentation website.
 *
 * @param {*} pkg
 * @returns {string}
 */
function parseGhPagesUrl (pkg) {
  try {
    // find gh-pages url
    const homepage = new URL(pkg.homepage)
    const [orgName, moduleName] = homepage.pathname.split('/').filter(Boolean)
    return `https://${orgName}.github.io/${moduleName}`
  } catch (/** @type {any} **/ err) {
    throw new Error(`Could not detect gh-pages url - does the package.json have a valid homepage key? - ${err.stack}`)
  }
}
