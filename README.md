# dignified.js

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Dependency Status](https://david-dm.org/dignifiedquire/dignified.js.svg?style=flat-square)](https://david-dm.org/dignifiedquire/dignified.js)
[![Travis CI](https://travis-ci.org/dignifiedquire/dignified.js.svg?branch=master)](https://travis-ci.org/dignifiedquire/dignified.js)

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
  "lint": "dignified-lint",
  "release": "dignified-release",
  "build": "dignifed-build",
  "test": "dignified-test",
  "test:node": "dignified-test node",
  "test:browser": "dignified-test browser",
  "coverage": "dignified-coverage"
}
```

## Tasks

### Linting

Linting uses [eslint](http://eslint.org/) and [standard](https://github.com/feross/standard) with some custom rules to
enforce some more strictness.

You can run it using

```bash
$ dignified-lint
# or as gulp task
$ gulp lint
```

### Testing

You can run it using

```bash
$ dignified-test
# or as gulp task
$ gulp test
```

There are also browser and node specific tasks

```bash
$ dignified-test node
$ gulp test:node
$ dignified-test browser
$ gulp test:browser
```

### Coverage

You can run it using

```bash
$ dignified-coverage
# or as gulp task
$ gulp coverage
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
$ dignified-build
# or as gulp task
$ gulp build
```

### Releasing

1. Run linting
2. Run tests
3. Build everything
4. Bump the version in `package.json`
5. Commit the version change
6. Create a git tag
7. Run `git push` to `upstream/master`

```bash
# Major release
$ gulp release major
$ dignified-release major
# Minor relase
$ gulp release minor
$ dignified-release minor
# Patch release
$ gulp release
$ dignified-release
```

## Other Notes

There is a badge.

```markdown
[![dignified.js](https://img.shields.io/badge/follows-dignified.js-blue.svg?style=flat-square)](https://github.com/dignifiedquire/dignified.js)
```

## License

MIT
