import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import eslintParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import rule from '../src/eslint/no-legacy-js-import.js'

// the rule checks `fs.existsSync` for the resolved import target, so tests need
// real files on disk. set up a fixtures dir with both a ts-only sibling and a
// real-js sibling so each scenario can resolve correctly.
const fixturesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aegir-no-legacy-js-import-'))
fs.writeFileSync(path.join(fixturesDir, 'only-ts.ts'), 'export const x = 1\n')
fs.writeFileSync(path.join(fixturesDir, 'real.js'), 'export const x = 1\n')
fs.writeFileSync(path.join(fixturesDir, 'real.ts'), 'export const x = 2\n')
const callerPath = path.join(fixturesDir, 'caller.ts')

process.on('exit', () => {
  fs.rmSync(fixturesDir, { recursive: true, force: true })
})

const ruleTester = new RuleTester({
  languageOptions: {
    parser: eslintParser,
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
})

ruleTester.run('no-legacy-js-import', rule, {
  valid: [
    {
      name: 'relative .ts import',
      filename: callerPath,
      code: "import { x } from './only-ts.ts'\n"
    },
    {
      name: 'relative .js import where the .js file actually exists',
      filename: callerPath,
      code: "import { x } from './real.js'\n"
    },
    {
      name: 'bare-module .js import (not relative)',
      filename: callerPath,
      code: "import { ed25519 } from '@noble/curves/ed25519.js'\n"
    },
    {
      name: 'relative .js where neither .js nor .ts sibling exists',
      filename: callerPath,
      code: "import { x } from './nothing.js'\n"
    }
  ],
  invalid: [
    {
      name: 'static import',
      filename: callerPath,
      code: "import { x } from './only-ts.js'\n",
      errors: [{ messageId: 'legacy' }],
      output: "import { x } from './only-ts.ts'\n"
    },
    {
      name: 'side-effect import',
      filename: callerPath,
      code: "import './only-ts.js'\n",
      errors: [{ messageId: 'legacy' }],
      output: "import './only-ts.ts'\n"
    },
    {
      name: 're-export',
      filename: callerPath,
      code: "export { x } from './only-ts.js'\n",
      errors: [{ messageId: 'legacy' }],
      output: "export { x } from './only-ts.ts'\n"
    },
    {
      name: 'export-all',
      filename: callerPath,
      code: "export * from './only-ts.js'\n",
      errors: [{ messageId: 'legacy' }],
      output: "export * from './only-ts.ts'\n"
    },
    {
      name: 'dynamic import',
      filename: callerPath,
      code: "const m = import('./only-ts.js')\n",
      errors: [{ messageId: 'legacy' }],
      output: "const m = import('./only-ts.ts')\n"
    }
  ]
})
