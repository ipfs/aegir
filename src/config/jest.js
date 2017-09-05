'use strict'

const path = require('path')

module.exports = {
  testMatch: [
    '**/test/**/*.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/'
  ],
  setupTestFrameworkScriptFile: path.join(__dirname, 'jest-setup.js'),
  rootDir: process.cwd(),
  coveragePathIgnorePatterns: [
    'node_modules',
    'test',
    'dist'
  ],
  coverageReporters: ['lcov'],
  coverageDirectory: 'coverage'
}
