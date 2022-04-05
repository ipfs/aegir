/* eslint-disable no-console */
'use strict'
const Listr = require('listr')
const path = require('path')
const { premove: del } = require('premove')

const tasks = new Listr([
  {
    title: 'clean ./dist',
    task: async () => del(path.join(process.cwd(), 'dist'))
  }
], { renderer: 'verbose' })

module.exports = tasks
