# Migration Guide v37 <!-- omit in toc -->

## Table of contents <!-- omit in toc -->

- [Scripts](#scripts)
- [Project detection](#project-detection)
- [Exports map](#exports-map)
- [ESM only](#esm-only)
- [aegir check-project](#aegir-check-project)
- [aegir release](#aegir-release)

## Scripts

You should use the following scripts to perform build steps:

```json
{
  "scripts": {
    "clean": "aegir clean",
    "lint": "aegir lint",
    "dep-check": "aegir dep-check",
    "build": "aegir build",
    "test": "aegir test",
    "test:node": "aegir test -t node --cov",
    "test:chrome": "aegir test -t browser --cov",
    "test:chrome-webworker": "aegir test -t webworker",
    "test:firefox": "aegir test -t browser -- --browser firefox",
    "test:firefox-webworker": "aegir test -t webworker -- --browser firefox",
    "test:electron-main": "aegir test -t electron-main",
    "release": "aegir release"
  }
}
```

Appropriate actions will take place based on the type of project aegir is run in.

## Project detection

We define 4 types of projects:

1. Typescript

If a project's `package.json` has `"type": "module"`, `"types": "..."`, and a file at `src/index.ts` it is considered a TypeScript project.

2. Typed ESM

If a project's `package.json` has `"type": "module"`, `"types": "..."`, and a file at `src/index.js` it is considered a Typed ESM project.

3. Typed CJS

If a project's `package.json` does not have `"type": "module"` but has `"types": "..."` and `"main": "..."`, it is considered a Typed CJS project.

4. Untyped CJS

If a project's `package.json` does not have `"type": "module"` but has `"main": "..."`, it is considered an Untyped CJS project.

Different steps will occur based on the type of project you have. For example when building the project, `tsc` will be run for all projects except Untyped CJS.

## Exports map

Aegir now has an exports map so some modules that were previously imported using deep requires will need to be updated:

**Before**

```js
// used in tests
import { expect } from 'aegir/utils/chai.js'

// an http echo server
import EchoServer from 'aegir/utils/echo-server.js'

// load a file from node_modules
import loadFixture from 'aegir/utils/fixtures.js'

// return a free port
import getPort from 'aegir/utils/get-port.js'

// returns the full path to a resource
import resolve from 'aegir/utils/resolve.js'
```

**After**

```js
// used in tests
import { expect } from 'aegir/chai'

// an http echo server
import EchoServer from 'aegir/echo-server'

// load a file from node_modules
import loadFixture from 'aegir/fixtures'

// return a free port
import getPort from 'aegir/get-port'

// returns the full path to a resource
import resolve from 'aegir/resolve'
```

## ESM only

The [default typescript config](../src/config/tsconfig.aegir.json) has been updated to output ESM-only code and [ipjs](https://www.npmjs.com/package/ipjs) has been removed.

A minimal tsconfig.json for your project may now look like:

```json
{
  "extends": "aegir/src/config/tsconfig.aegir.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": [
    "src",
    "test"
  ]
}
```

## aegir check-project

The [check-aegir-project](https://www.npmjs.com/package/check-aegir-project) tool has been integrated into aegir - it can be run with `aegir check-project`.

It will tell you when your project config is (probably) wrong or out of date and will attempt to correct it.

## aegir release

`aegir release` replaces `aegir release-minor`, `aegir release-major` and the old `aegir release`.

It uses [semantic-release](https://npmjs.com/package/semantic-release) behind the scenes and should be run in CI as part of [unified CI](https://github.com/protocol/.github/blob/master/templates/.github/workflows/js-test-and-release.yml#L133-L152).

Before `semantic-release` is run, the npm scripts `"clean"` and `"build"` are run, if present.
