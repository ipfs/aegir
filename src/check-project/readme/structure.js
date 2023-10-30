import path from 'path'
import fs from 'fs-extra'

/**
 * @param {string} monorepoDir
 * @param {string[]} projectDirs
 */
export const STRUCTURE = (monorepoDir, projectDirs) => {
  /** @type {Record<string, string>} */
  const packages = {}

  for (const projectDir of projectDirs.sort()) {
    const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))

    const key = projectDir.replace(monorepoDir, '')

    packages[key] = pkg.description
  }

  return `
## Packages

${Object.entries(packages).map(([key, value]) => {
  return `* [\`${key}\`](.${key}) ${value}`
}).join('\n')}
`
}
