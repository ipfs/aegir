'use strict'

const execa = require('execa')
const { getPathToPkg } = require('../utils')

const contributors = async () => {
  await execa('git-authors-cli', ['--print', 'false'])
  await execa('git', [
    'commit',
    getPathToPkg(),
    '-m',
    'chore: update contributors',
    '--no-verify',
    '--allow-empty'
  ])
}

module.exports = contributors
