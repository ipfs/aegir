'use strict'

const documentation = require('documentation')
const glob = require('glob')
const fs = require('fs-extra')
const pify = require('pify')
const chalk = require('chalk')
const vinyl = require('vinyl-fs')
const streamArray = require('stream-array')

const utils = require('../utils')
const introTmpl = require('../config/intro-template.md')

function generateDescription (pkg) {
  let example
  try {
    example = fs.readFileSync(utils.getPathToExample())
  } catch (err) {
    console.log(chalk.yellow('Warning: No `example.js` found in the root directory.'))
  }

  return introTmpl(pkg.name, pkg.repository.url, example)
}

function getOpts (pkg) {
  const opts = {
    github: true
  }
  const configFile = utils.getPathToDocsConfig()
  if (fs.existsSync(configFile)) {
    opts.config = configFile
  } else {
    opts.toc = [{
      name: 'Intro',
      description: generateDescription(pkg)
    }]
  }

  return opts
}

function writeDocs (output) {
  const docsPath = utils.getPathToDocs()
  return fs.ensureDir(docsPath)
    .then(() => new Promise((resolve, reject) => {
      streamArray(output)
        .pipe(vinyl.dest(docsPath))
        .once('error', reject)
        .once('end', resolve)
    }))
}

function writeMdDocs (output) {
  const docsPath = utils.getPathToDocs()
  return fs.ensureDir(docsPath)
    .then(() => fs.writeFileSync(utils.getPathToDocsMdFile(), output))
}

function build (ctx) {
  return Promise.all([
    utils.getPkg(),
    pify(glob)('./src/**/*.js', {
      cwd: process.cwd()
    })
  ]).then((res) => {
    const pkg = res[0]
    const files = res[1]

    return Promise.all(ctx.docsFormats.map((fmt) => {
      if (fmt === 'md') {
        return documentation.build(files, getOpts(pkg))
          .then((docs) => documentation.formats.md(docs))
          .then(writeMdDocs)
      }
      if (fmt === 'html') {
        return documentation.build(files, getOpts(pkg))
          .then((docs) => documentation.formats.html(docs, {
            theme: require.resolve('clean-documentation-theme'),
            version: pkg.version,
            name: pkg.name
          }))
          .then(writeDocs)
      }
    }))
  })
}

module.exports = build
