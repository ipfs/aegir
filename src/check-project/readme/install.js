/**
 * @param {*} pkg
 */
export const INSTALL = (pkg) => {
  return `
## Install

\`\`\`console
$ npm i ${pkg.name}
\`\`\`
  `
}
