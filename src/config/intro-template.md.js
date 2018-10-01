'use strict'

const _ = require('lodash')

function exampleTmpl (example) {
  if (!example) {
    return ''
  }

  return `

## Quick Example

\`\`\`js
${example}
\`\`\`

There are more available, so take a look at the docs below for a full list. This documentation aims to be comprehensive, so if you feel anything is missing please create a GitHub issue for it.`
}

module.exports = (pkg, library, name, distDir, distFile, url, example) => `
Installable via  \`npm install --save ${pkg}\`, it can also be used directly in the browser.

${exampleTmpl(example)}

## Download

The source is available for download from [GitHub](${url}). Alternatively, you can install using npm:

\`\`\`bash
$ npm install --save ${pkg}
\`\`\`

You can then \`require('${pkg}')\` as normal:

\`\`\`js
const ${library} = require('${pkg}')
\`\`\`

## In the Browser

${name} should work in any ES2015 environment out of the box.

Usage:

\`\`\`html
<script type="text/javascript" src="${distFile}.js"></script>
\`\`\`

The portable versions of ${name}, including \`${distFile}.js\` and \`${distFile}.min.js\`, are included in the \`/${distDir}\` folder. ${name} can also be found on [unpkg.com](https://unpkg.com) under

- https://unpkg.com/${pkg}/${distDir}/${distFile}.min.js
- https://unpkg.com/${pkg}/${distDir}/${distFile}.js
`
