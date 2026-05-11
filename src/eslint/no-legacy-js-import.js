import fs from 'node:fs'
import path from 'node:path'

/**
 * Disallow `import './foo.js'` in `.ts` source when no `./foo.js` exists on
 * disk and a `./foo.ts` sibling does. Catches the legacy "import the compiled
 * output path from TypeScript" pattern that breaks under Node's
 * `--experimental-strip-types` when no build step has run.
 *
 * Real `.js` files (mixed TS/JS projects) and bare-module specifiers are not
 * flagged. The rule is autofixable: `.js` is rewritten to `.ts`.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      legacy: "Use the '.ts' extension on this relative import — the '.js' file does not exist on disk, only the '.ts' source does."
    }
  },
  create (context) {
    /** @param {import('estree').Literal | null | undefined} source */
    const check = (source) => {
      if (source == null || source.type !== 'Literal') {
        return
      }
      const value = source.value
      if (typeof value !== 'string') {
        return
      }
      if (!value.startsWith('./') && !value.startsWith('../')) {
        return
      }
      if (!value.endsWith('.js')) {
        return
      }
      const target = path.resolve(path.dirname(context.filename), value)
      if (fs.existsSync(target)) {
        // real .js file exists; allow it
        return
      }
      if (!fs.existsSync(target.replace(/\.js$/, '.ts'))) {
        // no .ts sibling either; not our concern
        return
      }
      context.report({
        node: source,
        messageId: 'legacy',
        fix (fixer) {
          const [, end] = /** @type {[number, number]} */ (source.range)
          // surgical replace of 'js' (just before the closing quote) with 'ts'
          return fixer.replaceTextRange([end - 3, end - 1], 'ts')
        }
      })
    }
    return {
      ImportDeclaration: (node) => { check(node.source) },
      ExportNamedDeclaration: (node) => { check(node.source) },
      ExportAllDeclaration: (node) => { check(node.source) },
      ImportExpression: (node) => { check(node.source.type === 'Literal' ? node.source : null) }
    }
  }
}

export default rule
