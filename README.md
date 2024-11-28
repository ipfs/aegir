# aegir

[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/aegir.svg?style=flat-square)](https://codecov.io/gh/ipfs/aegir)
[![CI](https://img.shields.io/github/actions/workflow/status/ipfs/aegir/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/ipfs/aegir/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> JavaScript project management

Aegir is an opinionated tool for TypeScript/JavaScript project management, testing and release. You should use it if you just want to ship working code and have few strongly held opinions on linting, project layout and testing frameworks.

It bundles config for standard tools such as eslint, mocha, etc and lets you concentrate on writing code instead of formatting whitespace.

 ## Project Structure

 The project structure when using this is quite strict, to ease replication and configuration overhead.

 All source code should be placed under `src`, with the main entry point being `src/index.js` or `src/index.ts`.

 All test files should be placed under `test`. Individual test files should end in `.spec.js` or `.spec.ts` and will be ran in all environments (node, browser, webworker, electron-main and electron-renderer).

 To run node specific tests a file named `test/node.js` or `test/node.ts` should be used to require all node test files and the same thing for the other environments with a file named `test/browser.js` or `test/browser.ts`.

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
   aegir completion                   generate completion script
   aegir build                        Builds a browser bundle and TS type declara
                                      tions from the `src` folder.
   aegir check-project                Ensure your project has the correct config.
   aegir check                        Check project
   aegir clean [files..]              Remove created build artifacts.
   aegir dependency-check [input...]  Run `dependency-check` cli with aegir defau
                                      lts.              [aliases: dep-check, dep]
   aegir docs                         Generate documentation from TS type declara
                                      tions.
   aegir document-check [input...]    Run `document-check` cli with aegir default
                                      s.                     [aliases: doc-check]
   aegir lint-package-json            Lint package.json with aegir defaults.
                                                     [aliases: lint-package, lpj]
   aegir lint                         Lint all project files
   aegir release                      Release using semantic-release
   aegir release-rc                   Release an RC version of the current module
                                       or monorepo
   aegir test-dependant [repo]        Run the tests of an module that depends on
                                      this module to see if the current changes h
                                      ave caused a regression
   aegir test                         Test your code in different environments
   aegir exec <command>               Run a command in each project of a monorepo
   aegir run <scripts..>              Run one or more npm scripts in each project
                                       of a monorepo

 Global Options:
   -h, --help     Show help                                             [boolean]
   -v, --version  Show version number                                   [boolean]
   -d, --debug    Show debug output.                   [boolean] [default: false]

 Examples:
   aegir build                               Runs the build command to bundle JS
                                             code for the browser.
   npx aegir build                           Can be used with `npx` to use a loca
                                             l version
   aegir test -t webworker -- --browser fir  If the command supports `--` can be
   efox                                      used to forward options to the under
                                             lying tool.
   npm test -- -- --browser firefox          If `npm test` translates to `aegir t
                                             est -t browser` and you want to forw
                                             ard options you need to use `-- --`
                                             instead.

 Use `aegir <command> --help` to learn more about each command.
 ```

 ## Configuration

 Aegir can be fully configured using a config file named `.aegir.js` or the package.json using the property `aegir`.

 ### .aegir.js

 ```js
 module.exports = {
   tsRepo: true,
   release: {
     build: false
   }
 }
 ```

 ### package.json

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
 },
 "aegir" : {
   "tsRepo": false
 }
 ```

 You can find the complete default config [here](https://github.com/ipfs/aegir/blob/main/src/config/user.js#L12) and the types [here](https://github.com/ipfs/aegir/blob/main/src/types.d.ts).

 ## Continuous Integration

 Check this template for Github Actions <https://github.com/ipfs/aegir/blob/main/md/github-actions.md>

 ## Testing helpers

 In addition to running the tests `aegir` also provides several helpers to be used by the tests.

 Check the [documentation](https://ipfs.github.io/aegir/)

 ## Typescript

 Aegir will detect the presence of `tsconfig.json` files and build typescript as appropriate.

 ## Releases

 `aegir release` will run `semantic-release`-style auto-releases with every change to `main`.

 If you wish to batch changes up instead, please use `release-please`.

 ## Config updates

 You can keep your project configuration up to date by running:

 ```console
 $ npx aegir check-project
 ```

 It will attempt to add/amend any configuration files that require updating to the latest versions.

 If you have any custom config in your project please double check the edits it will make!

# Install

```console
$ npm i aegir
```

# API Docs

- <https://ipfs.github.io/aegir>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/ipfs/aegir/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/ipfs/aegir/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribute

Contributions welcome! Please check out [the issues](https://github.com/ipfs/aegir/issues).

Also see our [contributing document](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md) for more information on how we work, and about contributing in general.

Please be aware that all interactions related to this repo are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)
