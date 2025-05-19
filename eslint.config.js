import typescriptEslint from '@typescript-eslint/eslint-plugin'
// @ts-expect-error no types
import typescriptParser from '@typescript-eslint/parser'
import love from 'eslint-config-love'
// @ts-expect-error no types
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
// @ts-expect-error no types
import noOnlyTests from 'eslint-plugin-no-only-tests'

const MAX_NESTED_CALLBACKS = 4
const MAX_DEPTH = 4
const TAG_START_LINES = 1

/** @type {import('eslint').Linter.RulesRecord} */
const jsRules = {
  strict: ['error', 'safe'],
  curly: 'error',
  'block-scoped-var': 'error',
  complexity: 'warn',
  'default-case': 'error',
  'guard-for-in': 'warn',
  'linebreak-style': ['warn', 'unix'],
  'no-alert': 'error',
  'no-console': 'error',
  'no-div-regex': 'error',
  'no-empty': 'warn',
  'no-extra-semi': 'error',
  'no-implicit-coercion': 'error',
  'no-loop-func': 'error',
  'no-nested-ternary': 'warn',
  'no-script-url': 'error',
  'no-warning-comments': 'warn',
  'max-nested-callbacks': ['error', MAX_NESTED_CALLBACKS],
  'max-depth': ['error', MAX_DEPTH],
  'require-yield': 'error',
  'eslint-comments/require-description': 'off',
  'arrow-body-style': 'off',

  // plugins
  'no-only-tests/no-only-tests': 'error',

  'jsdoc/check-alignment': 'error',
  'jsdoc/check-examples': 'off',
  'jsdoc/check-indentation': 'error',
  'jsdoc/check-param-names': 'error',
  'jsdoc/check-syntax': 'error',
  'jsdoc/check-tag-names': ['error', { definedTags: ['internal', 'packageDocumentation'] }],
  'jsdoc/check-types': 'error',
  'jsdoc/implements-on-classes': 'error',
  'jsdoc/match-description': 'off',
  'jsdoc/tag-lines': ['error', 'any', { startLines: TAG_START_LINES }],
  'jsdoc/no-types': 'off',
  // Note: no-undefined-types rule causes to many false positives:
  // https://github.com/gajus/eslint-plugin-jsdoc/issues/559
  // And it is also unaware of many built in types
  // https://github.com/gajus/eslint-plugin-jsdoc/issues/280
  'jsdoc/no-undefined-types': 'off',
  'jsdoc/require-returns-type': 'off',
  'jsdoc/require-description': 'off',
  'jsdoc/require-description-complete-sentence': 'off',
  'jsdoc/require-example': 'off',
  'jsdoc/require-hyphen-before-param-description': 'error',
  'jsdoc/require-jsdoc': 'off',
  'jsdoc/require-param': 'error',
  'jsdoc/require-param-description': 'off',
  'jsdoc/require-param-name': 'error',
  'jsdoc/require-param-type': 'error',
  // Note: Do not require @returns because TS often can infer return types and
  // in many such cases it's not worth it.
  'jsdoc/require-returns': 'off',
  'jsdoc/require-returns-check': 'error',
  'jsdoc/require-returns-description': 'off',
  // Note: At the moment type parser used by eslint-plugin-jsdoc does not
  // parse various forms correctly. For now warn on invalid type from,
  // should revisit once following issue is fixed:
  // https://github.com/jsdoctypeparser/jsdoctypeparser/issues/50
  'jsdoc/valid-types': 'off',

  'import/order': [
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
  ]
}

/** @type {import('eslint').Linter.RulesRecord} */
const tsRules = {
  ...love.rules,
  ...jsRules,

  'no-use-before-define': 'off', // Types often are recursive & no use before define is too restrictive
  'no-return-await': 'off', // disable this rule to use @typescript-eslint/return-await instead
  'no-unused-vars': 'off', // disable this rule to use @typescript-eslint/no-unused-vars instead
  'no-undef': 'off', // typescript already checks for undefined variables so this is redundant - https://typescript-eslint.io/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors

  // 'etc/prefer-interface': 'error', // https://ncjamieson.com/prefer-interfaces/
  '@typescript-eslint/prefer-function-type': 'off', // conflicts with 'etc/prefer-interface'
  '@typescript-eslint/explicit-function-return-type': 'error', // functions require return types
  '@typescript-eslint/no-this-alias': 'off', // allow 'const self = this'
  '@typescript-eslint/await-thenable': 'error', // disallows awaiting a value that is not a "Thenable"
  '@typescript-eslint/restrict-template-expressions': 'off', // allow values with `any` type in template literals
  '@typescript-eslint/method-signature-style': ['error', 'method'], // enforce method signature style
  '@typescript-eslint/no-unsafe-argument': 'off', // allow passing args with `any` type to functions
  '@typescript-eslint/unbound-method': 'off', // allow invoking functions that may be unbound (e.g. passed as part of an options object)
  '@typescript-eslint/no-unused-vars': 'error', // disallow unused variables
  '@typescript-eslint/return-await': ['error', 'in-try-catch'], // require awaiting thenables returned from try/catch
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  'jsdoc/require-param': 'off', // do not require jsdoc for params
  'jsdoc/require-param-type': 'off' // allow compiler to derive param type
}

/**
 * @type {import('eslint').Linter.Config['plugins']}
 */
const plugins = {
  ...love.plugins,
  jsdoc,
  'no-only-tests': noOnlyTests,
  'import': importPlugin,
  '@typescript-eslint': typescriptEslint
}

/**
 * @typedef {import('eslint').Linter.Config} EslintConfig
 */

/** @type {EslintConfig[]} */
const config = [{
  ...love,
  languageOptions: {
  sourceType: 'module',
  parserOptions: {
    project: true
  }
},
  files: ['**/*.js', '**/*.jsx'],
  plugins,
  rules: jsRules
}, {
  ...love,
  languageOptions: {
  sourceType: 'module',
  parser: typescriptParser,
  parserOptions: {
    project: './tsconfig.json', // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser/README.md#parseroptionsproject
    projectService: true,
    tsconfigRootDir: import.meta.dirname,
  }
},
  files: ['**/*.ts', '**/*.tsx'],
  plugins,
  rules: tsRules
}]

export default config
