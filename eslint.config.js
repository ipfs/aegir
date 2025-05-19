// @ts-expect-error no types
import importPlugin from 'eslint-plugin-import'
// @ts-expect-error no types
import noOnlyTests from 'eslint-plugin-no-only-tests'
import neostandard from 'neostandard'

const standard = neostandard({
  env: ['node', 'browser', 'worker', 'serviceworker', 'webextensions', 'mocha', 'es2024'],
})

/**
 * @param {string} name
 * @returns {import('eslint').Linter.Config}
 */
function findRuleset (name) {
  const ruleset = standard.find(r => r.name === name)

  if (ruleset == null) {
    throw new Error(`Could not find ruleset "${name}`)
  }

  return ruleset
}

/**
 *
 * @param {import('eslint').Linter.StringSeverity} severity
 * @param {any[]} config
 *
 * @returns {import('eslint').Linter.RuleSeverity | import('eslint').Linter.RuleSeverityAndOptions<any>}
 */
function rule (severity, ...config) {
  if (config == null || config.length === 0) {
    return severity
  }

  return [severity, ...config]
}

const base = findRuleset('neostandard/base')
base.plugins = {
  ...base.plugins,
  'no-only-tests': noOnlyTests,
  import: importPlugin,
}
base.rules = {
  ...base.rules,
  'no-console': rule('error'),
  'no-only-tests/no-only-tests': rule('error'),
  'import/order': rule(
    'error',
    {
      alphabetize: {
        order: 'asc',
        caseInsensitive: false
      },
      'newlines-between': 'never',
      // the overall order of imports - anything not in this list is grouped together at the end
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type']
    }
  )
}

export default standard
