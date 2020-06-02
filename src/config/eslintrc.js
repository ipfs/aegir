'use strict'

module.exports = {
  extends: 'standard',
  parserOptions: {
    sourceType: 'script'
  },
  settings: {
    jsdoc: { mode: 'typescript' }
  },
  env: {
    browser: true
  },
  globals: {
    self: true
  },
  plugins: [
    'no-only-tests',
    'jsdoc'
  ],
  rules: {
    strict: [2, 'safe'],
    curly: 'error',
    'block-scoped-var': 2,
    complexity: 1,
    'default-case': 2,
    'dot-notation': 1,
    'guard-for-in': 1,
    'linebreak-style': [1, 'unix'],
    'no-alert': 2,
    'no-case-declarations': 2,
    'no-console': 2,
    'no-constant-condition': 2,
    'no-continue': 1,
    'no-div-regex': 2,
    'no-empty': 1,
    'no-empty-pattern': 2,
    'no-extra-semi': 2,
    'no-implicit-coercion': 2,
    'no-labels': 2,
    'no-loop-func': 2,
    'no-nested-ternary': 1,
    'no-only-tests/no-only-tests': 2,
    'no-script-url': 2,
    'no-warning-comments': 1,
    'quote-props': [2, 'as-needed'],
    'require-yield': 2,
    'max-nested-callbacks': [2, 4],
    'max-depth': [2, 4],
    'require-await': 2,
    'jsdoc/check-alignment': 2,
    'jsdoc/check-examples': 0,
    'jsdoc/check-indentation': 2,
    'jsdoc/check-param-names': 2,
    'jsdoc/check-syntax': 2,
    'jsdoc/check-tag-names': [2, { definedTags: ['internal', 'packageDocumentation'] }],
    'jsdoc/check-types': 2,
    'jsdoc/implements-on-classes': 2,
    'jsdoc/match-description': 0,
    'jsdoc/newline-after-description': 2,
    'jsdoc/no-types': 0,
    'jsdoc/no-undefined-types': 2,
    'jsdoc/require-description': 0,
    'jsdoc/require-description-complete-sentence': 0,
    'jsdoc/require-example': 0,
    'jsdoc/require-hyphen-before-param-description': 2,
    'jsdoc/require-jsdoc': 0,
    'jsdoc/require-param': 2,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 2,
    'jsdoc/require-param-type': 2,
    'jsdoc/require-returns': 2,
    'jsdoc/require-returns-check': 2,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 2,
    'jsdoc/valid-types': 2
  }
}
