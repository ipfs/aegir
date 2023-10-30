/**
 * @param {*} pkg
 */
export const INSTALL = (pkg) => {
  if (pkg.exports == null && pkg.main == null && pkg.bin == null) {
    // this module has no external API, skip installation instructions
    return ''
  }

  const nodeInstall = `
# Install

\`\`\`console
$ npm i ${pkg.name}
\`\`\`
`
  const browserInstall = `### Browser \`<script>\` tag

Loading this module through a script tag will make it's exports available as \`${nameToGlobalSymbol(pkg.name)}\` in the global namespace.

\`\`\`html
<script src="https://unpkg.com/${pkg.name}/dist/index.min.js"></script>
\`\`\`
`
  const scripts = pkg.scripts ?? {}

  // if the module tests on browsers include browser install instructions
  if (scripts['test:chrome'] != null || scripts['test:firefox'] != null || scripts['test:browser'] != null) {
    return nodeInstall + browserInstall
  }

  // otherwise just include node install instructions
  return nodeInstall
}

/**
 * Esbuild uses the module name to determine the symbol that's added to
 * the global scope by the minified build so replicate how it determines
 * the name in order to add it to the docs.
 *
 * @param {string} name
 * @returns {string}
 */
function nameToGlobalSymbol (name) {
  return name
    .replaceAll('@', '')
    .replaceAll('/', '-')
    .split('-')
    .map(part => `${part.substring(0, 1).toUpperCase()}${part.substring(1)}`)
    .join('')
}
