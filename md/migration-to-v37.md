# Migration Guide v37

## Scripts

You should use the following scripts to perform build steps:

```json
scripts": {
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
},
```

## Exports map

Aegir now has an exports map so some modules that were previously imported using deep requires will need to be updated:

** Before **

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

** After **

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
