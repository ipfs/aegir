'use strict'

const camelCase = require('camelcase')

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

module.exports = (name, url, example) => `
Installable via  \`npm install --save ${name}\`, it can also be used directly in the browser.

${exampleTmpl(example)}

## Download

The source is available for download from [GitHub](${url}). Alternatively, you can install using npm:

\`\`\`bash
$ npm install --save ${name}
\`\`\`

You can then \`require()\` ${name} as normal:

\`\`\`js
const ${camelCase(name)} = require('${name}')
\`\`\`

## In the Browser
\`${name}\` should work in any ECMAScript 2018 environment out of the box.

Usage:

\`\`\`html
<script type="text/javascript" src="index.js"></script>
\`\`\`

The portable versions of \`${name}\`, including \`index.js\` and \`index.min.js\`, are included in the \`/dist\` folder. \`${name}\` can also be found on [unpkg.com](https://unpkg.com) under

- https://unpkg.com/${name}/dist/index.min.js
- https://unpkg.com/${name}/dist/index.js
`
