# aegir <!-- omit in toc -->

[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/aegir.svg?style=flat-square)](https://codecov.io/gh/ipfs/aegir)
[![CI](https://img.shields.io/github/actions/workflow/status/ipfs/aegir/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/ipfs/aegir/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> JavaScript project management

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Project Structure](#project-structure)
- [CLI](#cli)
- [Configuration](#configuration)
- [Continuous Integration](#continuous-integration)
- [Testing helpers](#testing-helpers)
- [Typescript](#typescript)
- [Release steps](#release-steps)
- [API Docs](#api-docs)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i aegir
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `Aegir` in the global namespace.

```html
<script src="https://unpkg.com/aegir/dist/index.min.js"></script>
```

## Project Structure

The project structure when using this is quite strict, to ease replication and configuration overhead.

All source code should be placed under `src`, with the main entry point being `src/index.js` or `src/index.ts`.

All test files should be placed under `test`. Individual test files should end in `.spec.js` or `.spec.ts` and will be ran in all environments (node, browser, webworker, electron-main and electron-renderer). To run node specific tests a file named `test/node.js` or `test/node.ts` should be used to require all node test files and the same thing for the other environments with a file named `test/browser.js` or `test/browser.ts`.

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

## CLI

Run `aegir --help`

```bash
Usage: aegir <command> [options]

Commands:
  aegir build                        Builds a browser bundle and TS type declarations from the `src` folder.
  aegir check                        Check project
  aegir docs                         Generate documentation from TS type declarations.
  aegir doc-check                    Verify TS code snippets in documentation.
  aegir lint                         Lint all project files
  aegir release                      Release your code onto the world
  aegir test-dependant [repo]        Run the tests of an module that depends on this module to see if the current changes have caused a regression
  aegir test                         Test your code in different environments
  aegir dependency-check [input...]  Run `dependency-check` cli with aegir defaults.                                                                                                                              [aliases: dep-check, dep]
  aegir lint-package-json            Lint package.json with aegir defaults.                                                                                                                                    [aliases: lint-package, lpj]
  aegir completion                   generate completion script

Global Options:
  -h, --help     Show help                                                                                                                                                                                                        [boolean]
  -v, --version  Show version number                                                                                                                                                                                              [boolean]
  -d, --debug    Show debug output.                                                                                                                                                                              [boolean] [default: false]
      --ts-repo  Enable support for Typescript repos.                                                                                                                                                            [boolean] [default: false]

Examples:
  aegir build                                   Runs the build command to bundle JS code for the browser.
  npx aegir build                               Can be used with `npx` to use a local version
  aegir test -t webworker -- --browser firefox  If the command supports `--` can be used to forward options to the underlying tool.
  npm test -- -- --browser firefox              If `npm test` translates to `aegir test -t browser` and you want to forward options you need to use `-- --` instead.

Use `aegir <command> --help` to learn more about each command.
```

## Configuration

Aegir can be fully configured using a config file named `.aegir.js` or the package.json using the property `aegir`.

```js
// file: .aegir.js

/** @type {import('aegir').PartialOptions} */
module.exports = {
  tsRepo: true,
  release: {
    build: false,
  },
};
```

```json
// file: package.json
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
},
"aegir" : {
  "tsRepo": false
}
```

You can find the complete default config [here](https://github.com/ipfs/aegir/blob/master/src/config/user.js#L12) and the types [here](https://github.com/ipfs/aegir/blob/master/src/types.d.ts).

## Continuous Integration

Check this template for Github Actions <https://github.com/ipfs/aegir/blob/master/md/github-actions.md>

## Testing helpers

In addition to running the tests `aegir` also provides several helpers to be used by the tests.

Check the [documentation](https://ipfs.github.io/aegir/)

## Typescript

Aegir will detect the presence of `tsconfig.json` files and build typescript as appropriate.

## Release steps

1. Run linting
2. Run type check
3. Run tests
4. Bump the version in `package.json`
5. Build everything
6. Update contributors based on the git history
7. Generate a changelog based on the git log
8. Commit the version change & `CHANGELOG.md`
9. Create a git tag
10. Run `git push` to `origin/master`
11. Publish a release to Github releases
12. Generate documentation and push to Github Pages
13. Publish to npm

```bash
aegir release --help
```

## API Docs

- <https://ipfs.github.io/aegir>

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Contributions welcome! Please check out [the issues](https://github.com/ipfs/aegir/issues).

Also see our [contributing document](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md) for more information on how we work, and about contributing in general.

Please be aware that all interactions related to this repo are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)
