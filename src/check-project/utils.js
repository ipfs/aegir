/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as Diff from 'diff'
import kleur from 'kleur'
import prompt from 'prompt'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string} projectDir
 * @param {string} filePath
 * @param {string} [expectedContents]
 */
export async function ensureFileHasContents (projectDir, filePath, expectedContents) {
  const fileExists = fs.existsSync(path.join(projectDir, filePath))

  if (expectedContents == null) {
    expectedContents = fs.readFileSync(path.join(__dirname, 'files', filePath), {
      encoding: 'utf-8'
    })
  }

  expectedContents = expectedContents.trim() + '\n'

  let existingContents = ''

  if (fileExists) {
    const existingFilePath = path.join(projectDir, filePath)
    existingContents = fs.readFileSync(existingFilePath, {
      encoding: 'utf-8'
    })

    if (filePath.endsWith('.json')) {
      try {
        existingContents = JSON.stringify(JSON.parse(existingContents), null, 2) + '\n'
      } catch (err) {
        console.error('Could not parse', existingFilePath, 'as JSON')

        throw err
      }
    }
  } else {
    if (process.env.CI) {
      throw new Error(`${filePath} did not exist`)
    }

    console.warn(kleur.yellow(`${filePath} did not exist`))

    const { createFile } = await prompt.get({
      properties: {
        createFile: {
          description: `Create ${filePath}?`,
          type: 'boolean',
          default: true
        }
      }
    })

    if (!createFile) {
      console.warn(kleur.yellow(`${filePath} did not exist`))
      return
    }

    fs.mkdirSync(path.dirname(path.join(projectDir, filePath)), {
      recursive: true
    })
    fs.writeFileSync(path.join(projectDir, filePath), expectedContents)

    return
  }

  if (existingContents === expectedContents) {
    console.info(kleur.green(`${filePath} contents ok`))
  } else {
    if (process.env.CI) {
      throw new Error(`${filePath} contents not ok`)
    }

    console.warn(kleur.yellow(`${filePath} contents not ok`))
    console.warn('Diff', kleur.green('added'), kleur.red('removed'), kleur.grey('unchanged'))

    let diff = Diff.diffLines(existingContents, expectedContents)
    diff = diff.flatMap(part => {
      return part.value.trimEnd().split('\n')
        .map(line => {
          return {
            ...part,
            value: line.trimEnd()
          }
        })
    })
    /** @type {Array<{ include: boolean, added: boolean, removed: boolean, line: string }>} */
    const output = []

    // show this many lines before and after a diff
    const linesAround = 10
    let maxIncluded = 0

    diff.forEach((part, index) => {
      output.push({
        include: part.added ?? part.removed,
        added: part.added,
        removed: part.removed,
        line: part.value
      })
    })

    // include some lines around the change
    output.forEach((part, index) => {
      if (part.added || part.removed) {
        for (let i = index; i > index - linesAround; i--) {
          if (output[i] != null) {
            output[i].include = true
          }
        }

        for (let i = index; i < index + linesAround; i++) {
          if (output[i] != null) {
            output[i].include = true
            maxIncluded = i
          }
        }
      }
    })

    // print the diff, red for removed, green for added
    output.forEach((part, index) => {
      if (!part.include) {
        return
      }

      // green for additions, red for deletions
      // grey for common parts
      if (part.added) {
        console.info(kleur.grey(`${index.toString().padEnd(maxIncluded.toString().length, ' ')}:`), kleur.green(part.line))
      } else if (part.removed) {
        console.info(kleur.grey(`${index.toString().padEnd(maxIncluded.toString().length, ' ')}:`), kleur.red(part.line))
      } else {
        console.info(kleur.grey(`${index.toString().padEnd(maxIncluded.toString().length, ' ')}:`), kleur.grey(part.line))
      }
    })

    const { overwriteFile } = await prompt.get({
      properties: {
        overwriteFile: {
          description: `Overwrite ${path.join(projectDir, filePath)}?`,
          type: 'boolean',
          default: true
        }
      }
    })

    if (!overwriteFile) {
      console.warn(kleur.yellow(`Not overwriting ${filePath} file`))
      return
    }

    fs.mkdirSync(path.dirname(path.join(projectDir, filePath)), {
      recursive: true
    })
    fs.writeFileSync(path.join(projectDir, filePath), expectedContents)
  }
}

/**
 * @param {string} projectDir
 * @param {string} filePath
 */
export async function ensureFileNotPresent (projectDir, filePath) {
  const fullPath = path.join(projectDir, filePath)
  const fileExists = fs.existsSync(fullPath)

  if (fileExists) {
    if (process.env.CI) {
      throw new Error(`${filePath} exists`)
    }

    console.warn(kleur.yellow(`${filePath} exists`))

    const { removeFile } = await prompt.get({
      properties: {
        removeFile: {
          description: `Remove ${filePath}?`,
          type: 'boolean',
          default: true
        }
      }
    })

    if (!removeFile) {
      throw new Error(`Not removing ${filePath} file`)
    }

    fs.rmSync(fullPath)
  }
}

/**
 * @param {Record<string, any>} obj
 */
export function sortFields (obj) {
  if (!obj) {
    return
  }

  const keys = Object.keys(obj).sort()
  /** @type {Record<string, any>} */
  const output = {}

  keys.forEach(key => {
    output[key] = obj[key]
  })

  return output
}

/**
 * @param {Record<string, any>} obj
 */
export function sortExportsMap (obj) {
  /** @type {Record<string, any>} */
  const output = {}
  const sorted = sortFields(obj) ?? {}

  for (const key of Object.keys(sorted)) {
    const entry = sorted[key]

    // ignore case where obj has string props, e.g. `"exports": { "import": "./src/index.js" }`
    // as we have already merged `"exports": { ".": { "import": "./src/index.js" } }`
    if (typeof entry === 'string') {
      continue
    }

    let types = entry.types

    if (types == null && entry.import != null) {
      types = entry.import.replace('.js', '.d.ts')
    }

    delete entry.types

    output[key] = {
      // types field must be first - https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#package-json-exports-imports-and-self-referencing
      types,
      ...entry
    }

    // add `module-sync` field to allow `require`ing module - must be after
    // import
    if (output[key]['module-sync'] == null && output[key].import != null) {
      output[key] = {
        ...output[key],
        'module-sync': output[key].import
      }
    }
  }

  return output
}

/**
 * @param {any} manifest
 */
export function sortManifest (manifest) {
  const sorted = {
    ...manifest
  }

  sorted.dependencies = sortFields(manifest.dependencies)
  sorted.devDependencies = sortFields(manifest.devDependencies)
  sorted.optionalDependencies = sortFields(manifest.optionalDependencies)
  sorted.peerDependencies = sortFields(manifest.peerDependencies)
  sorted.peerDependenciesMeta = sortFields(manifest.peerDependenciesMeta)
  sorted.bundledDependencies = (manifest.bundledDependencies || []).sort()

  if (!sorted.bundledDependencies.length) {
    delete sorted.bundledDependencies
  }

  return sorted
}

/**
 * @param {any} manifest
 * @param {any} manifestFields
 * @param {string} repoUrl
 * @param {string} homePage
 */
export function constructManifest (manifest, manifestFields, repoUrl, homePage = repoUrl) {
  const output = {
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    author: manifest.author,
    license: 'Apache-2.0 OR MIT',
    homepage: `${homePage}#readme`,
    repository: {
      type: 'git',
      url: `git+${repoUrl}.git`
    },
    bugs: {
      url: `${repoUrl}/issues`
    },
    publishConfig: {
      access: 'public',
      provenance: true
    },
    keywords: manifest.keywords ? manifest.keywords.sort() : undefined,
    bin: manifest.bin,
    ...manifestFields,
    scripts: manifest.scripts,
    dependencies: manifest.dependencies,
    devDependencies: manifest.devDependencies,
    peerDependencies: manifest.peerDependencies,
    peerDependenciesMeta: manifest.peerDependenciesMeta,
    optionalDependencies: manifest.optionalDependencies,
    bundledDependencies: manifest.bundledDependencies
  }

  // remove publish-related fields if this module is not published
  if (manifest.private === true) {
    output.publishConfig = undefined
    output.files = undefined
    output.types = undefined
    output.typesVersions = undefined
    output.exports = undefined
    output.release = undefined

    // remove release fields from non-monorepo root manifests
    if (output.workspaces == null) {
      output.homepage = undefined
      output.repository = undefined
      output.bugs = undefined
      output.scripts.release = undefined
    }
  }

  return output
}

/**
 * Calculate a valid semver range for a monorepo sibling that will result
 * in as few releases as possible - e.g. don't rev "^1.2.0" to "^1.2.1" or
 * "^1.2.0" to "^1.3.0", instead prefer "^1.0.0" as "^1.2.1" and "^^1.3.0"
 * are both covered by that range.
 *
 * @param {string} version
 */
export function calculateSiblingVersion (version) {
  const [major, minor, patch] = version.split('.')

  if (major === '0') {
    if (minor === '0') {
      // turn ^0.0.1 -> ~0.0.1, otherwise you don't get 0.0.2, 0.0.3, etc
      return `~0.0.${patch}`
    }

    // turn ^1.4.1 -> ^1.4.0, otherwise every patch release causes all the sibling deps to change
    return `^${major}.${minor}.0`
  }

  // turn ^1.4.1 -> ^1.0.0, otherwise every minor release causes all the sibling deps to change
  return `^${major}.0.0`
}
