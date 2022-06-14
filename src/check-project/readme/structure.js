import fs from 'fs'
import path from 'path'

/**
 * @param {string} monorepoDir
 * @param {string[]} projectDirs
 */
export const STRUCTURE = (monorepoDir, projectDirs) => {
  /** @type {Record<string, string>} */
  const packages = {}

  for (const projectDir of projectDirs.sort()) {
    const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
      encoding: 'utf-8'
    }))

    const key = projectDir.replace(monorepoDir, '')

    packages[key] = pkg.description
  }

  return `
## Structure

${Object.entries(packages).map(([key, value]) => {
  return `* [\`${key}\`](.${key}) ${value}`
}).join('\n')}
`
}
