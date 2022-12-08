/**
 * @param {*} pkg
 */
export const INSTALL = (pkg) => {
  return `
## Install

\`\`\`console
$ npm i ${pkg.name}
\`\`\`

### Browser \`<script>\` tag

Loading this module through a script tag will make it's exports available as \`${nameToGlobalSymbol(pkg.name)}\` in the global namespace.

\`\`\`html
<script src="https://unpkg.com/${pkg.name}/dist/index.min.js"></script>
\`\`\`
  `
}

/**
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
