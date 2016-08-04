# AEgir

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Dependency Status](https://david-dm.org/dignifiedquire/aegir.svg?style=flat-square)](https://david-dm.org/dignifiedquire/aegir)
[![Travis CI](https://travis-ci.org/dignifiedquire/aegir.svg?branch=master)](https://travis-ci.org/dignifiedquire/aegir)

> Automated JavaScript project management.


## Project Structure

The project structure when using this is quite strict, to ease
replication and configuration overhead.

All source code should be placed under `src`, with the main entry
point being `src/index.js`.

All test files should be placed under `test`. Individual test files should end in `.spec.js` and setup files for the node and the browser should be `test/node.js` and `test/browser.js` respectively.

Your `package.json` should have the following entries.


```json
"main": "lib/index.js",
"jsnext:main": "src/index.js",
"scripts": {
  "lint": "aegir-lint",
  "release": "aegir-release",
  "build": "aegir-build",
  "test": "aegir-test",
  "test:node": "aegir-test node",
  "test:browser": "aegir-test browser",
  "coverage": "aegir-coverage",
  "coverage-publish": "aegir-coverage publish"
}
```

You should also add `babel-runtime` to your `dependencies` as it is required by the babelified version in `lib`.

## Stack Requirements

To bring you its many benefits, `aegir` requires

- [ES6 / Babel](https://github.com/babel/babel) transpilation
- JS written in [Standard](https://github.com/feross/standard) style
- Tests written in [Mocha](https://github.com/mochajs/mocha)
- [Karma](https://github.com/karma-runner/karma) for browser tests


## Tasks

### Linting

Linting uses [eslint](http://eslint.org/) and [standard](https://github.com/feross/standard)
with [some custom rules](config/eslintrc.yml) to enforce some more strictness.

You can run it using

```bash
$ aegir-lint
# or as gulp task
$ gulp lint
```

### Testing

You can run it using

```bash
$ aegir-test
# or as gulp task
$ gulp test
```

There are also browser and node specific tasks

```bash
$ aegir-test node
$ gulp test:node
$ aegir-test browser
$ gulp test:browser
```

### Coverage

You can run it using

```bash
$ aegir-coverage
# or as gulp task
$ gulp coverage
```

To auto publish coverage reports from Travis to Coveralls add this to
your `.travis.yml` file. For more details see [node-coveralls](https://github.com/nickmerwin/node-coveralls).

```yml
script:
  - npm run coverage

after_success:
  - npm run coverage-publish
```

### Building

This will build a browser ready version into `dist`, so after publishing the results will be available under

```
https://npmcdn.com/<module-name>/dist/index.js
https://npmcdn.com/<module-name>/dist/index.min.js
```

There is also an ES5 build that will be placed in `lib` that will be required by default from consumers using `require`.

You can run it using

```bash
$ aegir-build
# or as gulp task
$ gulp build
```

### Releasing

1. Run linting
2. Run tests
3. Build everything
4. Bump the version in `package.json`
5. Generate a changelog based on the git log
6. Commit the version change & `CHANGELOG.md`
7. Create a git tag
8. Run `git push` to `upstream/master`
9. Publish a release to Github releases (if `GH_TOKEN` is available)
10. Publish to npm

```bash
# Major release
$ gulp release --type major
$ aegir-release --type major
# Minor relase
$ gulp release --type minor
$ aegir-release --type minor
# Patch release
$ gulp release
$ aegir-release
```

You can also specify a `--env` for a release, which can be either
`'node'`, `'browser'` or `'no-build'`.

```bash
$ aegir-release --env node
$ gulp release --env node
```

You can generate a changelog for all versions by using `--first`

```bash
$ aegir-relase --first
```

You can skip all changelog generation and the github release by passing
in `--no-changelog`.

## Other Notes

There is a badge.

```markdown
[![aegir](https://img.shields.io/badge/follows-aegir-blue.svg?style=flat-square)](https://github.com/dignifiedquire/aegir)
```

## License

MIT
