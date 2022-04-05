# ESM support

## Setup

`aegir` will automatically identify a `esm` repo by the `module` property in `package.json`.

## Electron testing

Electron supports ESM but [electron-mocha does not](https://github.com/jprichardson/electron-mocha/pull/187).  It's capable of supporting it in the main thread but since Chrome does not provide any way to intercept calls to `import` it's unlikely to work with the renderer thread for the foreseeable future.

We currently use a [fork of electron-mocha](https://www.npmjs.com/package/electron-mocha-main) that allows running ESM tests on the main thread but we have no support for running them on the renderer thread until the issues with Chrome and intercepting `import` above are resolved.

## Examples

TODO: List examples when merged (`ipfs-unixfs`, `uint8arrays`)
