# AEgir

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Travis CI](https://flat.badgen.net/travis/ipfs/aegir)](https://travis-ci.com/ipfs/aegir)
[![Dependency Status](https://david-dm.org/ipfs/aegir.svg?style=flat-square)](https://david-dm.org/ipfs/aegir)

> Automated JavaScript project management.

## Lead Maintainer

[Hugo Dias](https://github.com/hugomrdias)


## Project Structure

The project structure when using this is quite strict, to ease
replication and configuration overhead.

All source code should be placed under `src`, with the main entry
point being `src/index.js`.

All test files should be placed under `test`. Individual test files should end in `.spec.js` and setup files for the node and the browser should be `test/node.js` and `test/browser.js` respectively.

Your `package.json` should have the following entries and should pass `aegir lint-package-json`.


```json
"main": "src/index.js",
"files": [
  "src",
  "dist"
],
"scripts": {
  "lint": "aegir lint",
  "release": "aegir release",
  "build": "aegir build",
  "test": "aegir test",
  "test:node": "aegir test --target node",
  "test:browser": "aegir test --target browser"
}
```
## Travis Setup

Check this tutorial https://github.com/ipfs/aegir/wiki/Travis-Setup


## Stack Requirements

To bring you its many benefits, `aegir` requires

- JS written in [Standard](https://github.com/feross/standard) style
- Tests written in [Mocha](https://github.com/mochajs/mocha)
- [Karma](https://github.com/karma-runner/karma) for browser tests

## Testing helpers
In addition to running the tests `aegir` also provides several helpers to be used by the tests.

#### Fixtures

Loading fixture files in node and the browser can be painful, that's why aegir provides
a method to do this. For it to work you have to put your fixtures in the folder `test/fixtures`, and then

```js
// test/awesome.spec.js
const loadFixture = require('aegir/fixtures')

const myFixture = loadFixture('test/fixtures/largefixture')
```

The path to the fixture is relative to the module root.

If you write a module like [interface-ipfs-core](https://github.com/ipfs/interface-ipfs-core)
which is to be consumed by other modules tests you need to pass in a third parameter such that
the server is able to serve the correct files.

For example

```js
// awesome-tests module
const loadFixture = require('aegir/fixtures')

const myFixture = loadFixture('test/fixtures/coolfixture', 'awesome-tests')
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

#### Echo Server
HTTP echo server for testing purposes.

```js
const EchoServer = require('aegir/utils/echo-server')
const server = new EchoServer()
await server.start()

// search params echo endpoint
const req = await fetch('http://127.0.0.1:3000/echo/query?test=one')
console.log(await req.text())

// body echo endpoint
const req = await fetch('http://127.0.0.1:3000/echo', {
  method: 'POST',
  body: '{"key": "value"}'
})
console.log(await req.text())

// redirect endpoint
const req = await fetch('http://127.0.0.1:3000/redirect?to=http://127.0.0.1:3000/echo')
console.log(await req.text())

// download endpoint
const req = await fetch('http://127.0.0.1:3000/download?data=helloWorld')
console.log(await req.text())

await server.stop()

```

#### Get Port
Helper to find an available port to put a server listening on.
```js
const getPort = require('aegir/utils/get-port')
const port = await getPort(3000, '127.0.0.1')
// if 3000 is available returns 3000 if not returns a free port.

```

## Tasks

### Linting

Linting uses [eslint](http://eslint.org/) and [standard](https://github.com/feross/standard)
with [some custom rules](https://github.com/ipfs/eslint-config-aegir) to enforce some more strictness.

You can run it using

```bash
$ aegir lint
$ aegir lint-package-json
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


### Coverage

#### Node
You can run your tests with `nyc` using

```bash
$ npx nyc -s aegir test -t node
# to check the report locally 
$ npx nyc report --reporter=html && open coverage/index.html
# or just for a text based reporter
$ npx nyc report
```
#### Browser
> Not available yet PR open.


To auto publish coverage reports from Travis to Codecov add this to
your `.travis.yml` file.

```yml
after_success: npx nyc report --reporter=text-lcov > coverage.lcov && npx codecov
```

### Building


You can run it using

```bash
$ aegir build
```
This will build a browser ready version into `dist`, so after publishing the results will be available under

```
https://unpkg.com/<module-name>/dist/index.js
https://unpkg.com/<module-name>/dist/index.min.js
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

#### Generating Webpack stats.json

Pass the `--analyze` option to have Webpack generate a `stats.json` file for the bundle and save it in the project root (see https://webpack.js.org/api/stats/). e.g.

```bash
aegir build --analyze
```

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

# Major prerelease (1.0.0 -> 2.0.0-rc.0)
$ aegir release --type premajor --preid rc --dist-tag next
# Minor prerelease (1.0.0 -> 1.1.0-rc.0)
$ aegir release --type preminor --preid rc --dist-tag next
# Patch prerelease (1.0.0 -> 1.0.1-rc.0)
$ aegir release --type prepatch --preid rc --dist-tag next

# Increment prerelease (1.1.0-rc.0 -> 1.1.0-rc.1)
$ aegir release --type prerelease --preid rc --dist-tag next
```

> This requires `AEGIR_GHTOKEN` to be set.

You can also specify the same targets as for `test`.

If no `CHANGELOG.md` is present, one is generated the first time a release is done.

You can skip all changelog generation and the github release by passing
in `--no-changelog`.

If you want no documentation generation you can pass `--no-docs` to the release task to disable documentation builds.

#### Scoped Github Token

Performing a release involves creating new commits and tags and then pushing them back to the repository you are releasing from. In order to do this you should create a [GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) and store it in the environmental variable `AEGIR_GHTOKEN`.   

The only access scope it needs is `public_repo`.

Be aware that by storing it in `~/.profile` or similar you will make it available to any program that runs on your computer.

### Documentation

You can use `aegir docs` to generate documentation. This uses [documentation.js](http://documentation.js.org/) with the theme [clean-documentation-theme](https://github.com/dignifiedquire/clean-documentation-theme).

To publish the documentation automatically to the `gh-pages` branch you can run

```bash
$ aegir docs --publish
```

## License

MIT
