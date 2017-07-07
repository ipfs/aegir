'use strict'

module.exports = {
  testMatch: [
    '**/test/**/?(*.)spec.js?(x)',
    '**/test/(browser|node).js?(x)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/'
  ],
  rootDir: process.cwd(),
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/node_modules/**',
    '!**/test/**',
    '!**/dist/**'
  ],
  coverageReporters: ['lcov'],
  coverageDirectory: 'coverage'
}
