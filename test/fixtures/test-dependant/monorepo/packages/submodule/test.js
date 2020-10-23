'use strict'

const pkg = require('it-all/package.json')

console.info(`${process.env.DISAMBIGUATOR}-dependency-version=${pkg.version}`) // eslint-disable-line no-console
