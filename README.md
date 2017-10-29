# AEgir

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Dependency Status](https://david-dm.org/ipfs/aegir.svg?style=flat-square)](https://david-dm.org/ipfs/aegir)
[![Travis CI](https://travis-ci.org/ipfs/aegir.svg?branch=master)](https://travis-ci.org/ipfs/aegir) [![Build status](https://ci.appveyor.com/api/projects/status/f0bv0fl4tmb1hs1w?svg=true)](https://ci.appveyor.com/project/dignifiedquire/aegir)

> Automated JavaScript project management.


## Migration from `v11`

There was a large refactor from `v11` to `v12`, so there is some migration needed. All features you need should still be there, but you might need to change some things.

### Custom Config

The `aegir` section in `package.json` was not really useful anymore so it is not supported anymore. Any custom configuration you need can be done in `.aegir.js`.

### Pre and Post Hooks

As we are no longer using `gulp` the previous setup using a custom `gulpfile` will not work anymore. To setup hooks around your tests you can use a new configuration option `hooks` in `.aegir.js`.

```js
// .aegir.js
module.exports = {
  hooks: {
    pre (callback) {
      console.log('I am called before node and browser tests')
      callback()
    },
    post (callback) {
      console.log('I am called after node and browser tests')
      callback()
    }
  }
}
```

You can also specify `hooks.browser` and `hooks.node` if you have a different setup for browser and/or node based tests.

### Renamed binaries

`aegir` is now a single binary with subcommands. You should rename `aegir-test` to `aegir test` in your scripts.

### Scoped Github Token

The token needed for releases is now looked for after under `AEGIR_GHTOKEN`.

## Project Structure

The project structure when using this is quite strict, to ease
replication and configuration overhead.

All source code should be placed under `src`, with the main entry
point being `src/index.js`.

All test files should be placed under `test`. Individual test files should end in `.spec.js` and setup files for the node and the browser should be `test/node.js` and `test/browser.js` respectively.

Your `package.json` should have the following entries.


```json
"main": "src/index.js",
"scripts": {
  "lint": "aegir lint",
  "release": "aegir release",
  "build": "aegir build",
  "test": "aegir test",
  "test:node": "aegir test --target node",
  "test:browser": "aegir test --target browser",
  "coverage": "aegir coverage",
  "coverage-publish": "aegir coverage --upload"
}
```

## Stack Requirements

To bring you its many benefits, `aegir` requires

- JS written in [Standard](https://github.com/feross/standard) style
- Tests written in [Mocha](https://github.com/mochajs/mocha)
- [Karma](https://github.com/karma-runner/karma) for browser tests

## Tasks

### Linting

Linting uses [eslint](http://eslint.org/) and [standard](https://github.com/feross/standard)
with [some custom rules](https://github.com/ipfs/eslint-config-aegir) to enforce some more strictness.

You can run it using

```bash
$ aegir lint
```

### Testing

You can run it using

```bash
$ aegir test
```

There are also browser and node specific tasks

```bash
$ aegir test --target node
$ aegir test --target browser
$ aegir test --target webworker
```

#### Fixtures

Loading fixture files in node and the browser can be painful, that's why aegir provides
a method to do this. For it to work you have to put your fixtures in the folder `test/fixtures`, and then

```js
// test/awesome.spec.js
const loadFixture = require('aegir/fixtures')

const myFixture = loadFixture(__dirname, 'fixtures/largefixture')
```

If you write a module like [interface-ipfs-core](https://github.com/ipfs/interface-ipfs-core)
which is to be consumed by other modules tests you need to pass in a third parameter such that
the server is able to serve the correct files.

For example

```js
// awesome-tests module
const loadFixture = require('aegir/fixtures')

const myFixture = loadFixture(__dirname, 'fixtures/coolfixture', 'awesome-tests')
```

```js
// tests for module using the awesome-tests
require('awesome-tests')
```

```js
// .aegir.js file in the module using the awesome-tests module
'use strict'

module.exports = {
  karma: {
    files: [{
      pattern: 'node_modules/awesome-tests/test/fixtures/**/*',
      watched: false,
      served: true,
      included: false
    }]
  }
}
```


### Coverage

You can run it using

```bash
$ aegir coverage
```

To auto publish coverage reports from Travis to Coveralls add this to
your `.travis.yml` file. For more details see [node-coveralls](https://github.com/nickmerwin/node-coveralls).

```yml
script:
  - npm run coverage -- -upload
```

### Building

This will build a browser ready version into `dist`, so after publishing the results will be available under

```
https://unpkg.com/<module-name>/dist/index.js
https://unpkg.com/<module-name>/dist/index.min.js
```

You can run it using

```bash
$ aegir build
```

**Specifying a custom entry file for Webpack**

By default, `aegir` uses `src/index.js` as the entry file for Webpack. You can customize which file to use as the entry point by specifying `entry` field in your user configuration file. To do this, create `.aegir.js` file in your project's root diretory and add point the `entry` field to the file Webpack should use as the entry:

```javascript
module.exports = {
  entry: "src/browser-index.js",
}
```

Webpack will use the specified file as the entry point and output it to `dist/<filename>`, eg. `dist/browser-index.js`.

If `.aegir.js` file is not present in the project, webpack will use `src/index.js` as the default entry file.

### Releasing

1. Run linting
2. Run tests
3. Build everything
4. Bump the version in `package.json`
5. Generate a changelog based on the git log
6. Commit the version change & `CHANGELOG.md`
7. Create a git tag
8. Run `git push` to `origin/master`
9. Publish a release to Github releases
10. Generate documentation and push to github
11. Publish to npm

```bash
# Major release
$ aegir release --type major
# Minor relase
$ aegir release --type minor
# Patch release
$ aegir release
```

> This requires `AEGIR_GHTOKEN` to be set.

You can also specify the same targets as for `test`.

If no `CHANGELOG.md` is present, one is generated the first time a release is done.

You can skip all changelog generation and the github release by passing
in `--no-changelog`.

If you want no documentation generation you can pass `--no-docs` to the release task to disable documentation builds.

### Documentation

You can use `aegir-docs` to generate documentation. This uses [documentation.js](http://documentation.js.org/) with the theme [clean-documentation-theme](https://github.com/dignifiedquire/clean-documentation-theme).

To publish the documentation automatically to the `gh-pages` branch you can run

```bash
$ aegir docs --publish
```

## License

MIT
