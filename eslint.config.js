import assert from 'node:assert'
import eslintParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
// @ts-expect-error no types
import noOnlyTests from 'eslint-plugin-no-only-tests'
import neostandard from 'neostandard'

const config = neostandard({
  env: ['node', 'browser', 'worker', 'serviceworker', 'webextensions', 'mocha', 'es2024'],
  ignores: ['dist/**/*'],
  ts: true
})

/**
 * @param {string} rules
 * @param {string} name
 * @param {any} value
 */
function addRule (rules, name, value) {
  const ruleSet = config.find(c => c.name === rules)

  assert.ok(ruleSet, `No ruleset with name ${rules} found`)
  assert.notDeepEqual(ruleSet.rules?.[name], value, `${rules}/${name} is already set to ${JSON.stringify(value, null, 2)}`)

  ruleSet.rules ??= {}
  ruleSet.rules[name] = value
}

/**
 * @param {string} rules
 * @param {string} name
 * @param {any} value
 */
function addPlugin (rules, name, value) {
  const ruleSet = config.find(c => c.name === rules)

  assert.ok(ruleSet, `No ruleset with name ${rules} found`)
  assert(ruleSet.plugins?.[name] == null, `${rules} already has plugin ${name}`)

  ruleSet.plugins ??= {}
  ruleSet.plugins[name] = value
}

/**
 * @param {string} rules
 * @param {any} parser
 * @param {any} options
 */
function setParser (rules, parser, options) {
  const ruleSet = config.find(c => c.name === rules)

  assert.ok(ruleSet, `No ruleset with name ${rules} found`)

  ruleSet.languageOptions ??= {}
  ruleSet.languageOptions.parser = parser
  ruleSet.languageOptions.parserOptions = options
}

addPlugin('neostandard/base', 'no-only-tests', noOnlyTests)
addPlugin('neostandard/base', 'import', importPlugin)

addRule('neostandard/base', 'strict', ['error', 'safe'])
addRule('neostandard/base', 'curly', 'error')
addRule('neostandard/base', 'block-scoped-var', 'error')
addRule('neostandard/base', 'complexity', 'warn')
addRule('neostandard/base', 'default-case', 'error')
addRule('neostandard/base', 'guard-for-in', 'warn')
addRule('neostandard/base', 'linebreak-style', ['warn', 'unix'])
addRule('neostandard/base', 'no-alert', 'error')
addRule('neostandard/base', 'no-console', 'error')
addRule('neostandard/base', 'no-div-regex', 'error')
addRule('neostandard/base', 'no-empty', 'warn')
addRule('neostandard/base', 'no-extra-semi', 'error')
addRule('neostandard/base', 'no-implicit-coercion', 'error')
addRule('neostandard/base', 'no-loop-func', 'error')
addRule('neostandard/base', 'no-nested-ternary', 'warn')
addRule('neostandard/base', 'no-script-url', 'error')
addRule('neostandard/base', 'no-warning-comments', 'warn')
addRule('neostandard/base', 'max-nested-callbacks', ['error', 4])
addRule('neostandard/base', 'max-depth', ['error', 4])
addRule('neostandard/base', 'require-yield', 'error')
addRule('neostandard/base', 'no-void', ['error', {
  allowAsStatement: true
}])

// plugins
addRule('neostandard/base', 'no-only-tests/no-only-tests', 'error')
addRule('neostandard/base', 'import/order', [
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
])

addRule('neostandard/style/modernization-since-standard-17', '@stylistic/comma-dangle', [
  'error',
  {
    arrays: 'never',
    objects: 'never',
    imports: 'never',
    exports: 'never',
    functions: 'never'
  }
])

setParser('neostandard/ts', eslintParser, {
  projectService: true,
  sourceType: 'module',
  ecmaVersion: 'latest'
})

// TODO: not compatible with ESLint 9x yet
// addPlugin('neostandard/ts', 'etc', etc)
// addRule('neostandard/ts', 'etc/prefer-interface', 'error') // https://ncjamieson.com/prefer-interfaces/

addRule('neostandard/ts', 'no-return-await', 'off') // disable this rule to use @typescript-eslint/return-await instead
addRule('neostandard/ts', '@typescript-eslint/no-use-before-define', [
  'error', {
    functions: false,
    classes: false,
    enums: false,
    variables: false,
    typedefs: false
  }
]) // Types often are recursive & no use before define is too restrictive
addRule('neostandard/ts', '@typescript-eslint/prefer-function-type', 'off') // conflicts with 'etc/prefer-interface'
addRule('neostandard/ts', '@typescript-eslint/explicit-function-return-type', [
  'error', {
    allowExpressions: true,
    allowHigherOrderFunctions: true,
    allowTypedFunctionExpressions: true,
    allowDirectConstAssertionInArrowFunctions: true
  }
]) // functions require return types
addRule('neostandard/ts', '@typescript-eslint/no-this-alias', 'off') // allow 'const self = this'
addRule('neostandard/ts', '@typescript-eslint/await-thenable', 'error') // disallows awaiting a value that is not a "Thenable"
addRule('neostandard/ts', '@typescript-eslint/restrict-template-expressions', 'off') // allow values with `any` type in template literals
addRule('neostandard/ts', '@typescript-eslint/method-signature-style', ['error', 'method']) // enforce method signature style
addRule('neostandard/ts', '@typescript-eslint/no-unsafe-argument', 'off') // allow passing args with `any` type to functions
addRule('neostandard/ts', '@typescript-eslint/unbound-method', 'off') // allow invoking functions that may be unbound (e.g. passed as part of an options object)
addRule('neostandard/ts', '@typescript-eslint/return-await', ['error', 'in-try-catch']) // require awaiting thenables returned from try/catch
addRule('neostandard/ts', '@typescript-eslint/only-throw-error', 'error') // only throw Error objects
addRule('neostandard/ts', 'jsdoc/require-param', 'off') // do not require jsdoc for params
addRule('neostandard/ts', 'jsdoc/require-param-type', 'off') // allow compiler to derive param type
addRule('neostandard/ts', 'import/consistent-type-specifier-style', ['error', 'prefer-top-level']) // prefer `import type { Foo }` over `import { type Foo }`

const jsdocSettings = {
  mode: 'typescript',
  tagNamePreference: {
    augments: {
      message: '@extends is to be used over @augments as it is more evocative of classes than @augments',
      replacement: 'extends'
    }
  },
  structuredTags: {
    extends: {
      type: true
    }
  }
}

const jsdocConfig = {
  name: 'aegir/jsdoc',
  files: ['**/*.?(c|m)@(t|j)s?(x)'],
  ignores: ['dist/**/*'],
  plugins: {
    jsdoc
  },
  settings: {
    jsdoc: jsdocSettings
  },
  rules: {
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-examples': 'off',
    'jsdoc/check-indentation': 'error',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-syntax': 'error',
    'jsdoc/check-tag-names': ['error', { definedTags: ['internal', 'packageDocumentation'] }],
    'jsdoc/check-types': 'error',
    'jsdoc/implements-on-classes': 'error',
    'jsdoc/match-description': 'off',
    'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
    'jsdoc/no-types': 'off',
    // Note: no-undefined-types rule causes to many false positives:
    // https://github.com/gajus/eslint-plugin-jsdoc/issues/559
    // And it is also unaware of many built in types
    // https://github.com/gajus/eslint-plugin-jsdoc/issues/280
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/require-yields': 'off',
    'jsdoc/require-description': 'off',
    'jsdoc/require-description-complete-sentence': 'off',
    'jsdoc/require-example': 'off',
    'jsdoc/require-hyphen-before-param-description': 'error',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param-type': 'off',
    // Note: Do not require @returns because TS often can infer return types and
    // in many such cases it's not worth it.
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-check': 'error',
    'jsdoc/require-returns-description': 'off',
    // Note: At the moment type parser used by eslint-plugin-jsdoc does not
    // parse various forms correctly. For now warn on invalid type from,
    // should revisit once following issue is fixed:
    // https://github.com/jsdoctypeparser/jsdoctypeparser/issues/50
    'jsdoc/valid-types': 'off'
  }
}

const jsdocTsConfig = {
  name: 'aegir/jsdoc/ts',
  files: ['**/*.?(c|m)ts?(x)'],
  ignores: ['dist/**/*'],
  plugins: {
    jsdoc
  },
  settings: {
    jsdoc: jsdocSettings
  },
  rules: {
    'jsdoc/require-param': 'off', // do not require jsdoc for params
    'jsdoc/require-param-type': 'off' // allow compiler to derive param type
  }
}

export default [
  // js(x)/ts(x)
  ...config,

  // jsdoc
  jsdoc.configs['flat/recommended-typescript-flavor'],
  jsdocConfig,
  jsdocTsConfig
]
