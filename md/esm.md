# ESM support

## Setup

`aegir` leverages [ipjs](https://github.com/mikeal/ipjs) to output a build with `cjs` and `esm` for maximum compatibility. The general guidelines for writing a module in `esm` are detailed on the `ipjs` README. `aegir` will automatically identify a `esm` repo by the `module` property in `package.json`.

## Electron testing

Electron does [not support ESM](https://github.com/electron/electron/issues/21457) at the time of writing. When writing a module using ESM, we need to compile the tests to `cjs` and rely on them. For generating the build including the tests:

```bash
aegir build --esm-tests
```

## Lerna Monorepo

When using a lerna monorepo, local dependencies are symlinked by lerna on install. This means that an `esm` module will not use the resulting `dist` folder as symlink. This can become a problem if we are testing the `cjs` build of a module.

To work around the above problem, we can use `publishConfig.directory = "dist"` in `package.json` to notice lerna about the symlink path. After running the `aegir build` command, it is necessary to run `lerna link` to update the symlinks.

## Release

When releasing an `esm` module, the published content will be the generated `dist` folder content, as indicated by [ipjs](https://github.com/mikeal/ipjs).

## Examples

TODO: List examples when merged (`ipfs-unixfs`, `uint8arrays`)