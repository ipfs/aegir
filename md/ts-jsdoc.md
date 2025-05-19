# TS with JSDoc  <!-- omit in toc -->

## Table of Contents  <!-- omit in toc -->
- [Getting Started](#getting-started)
- [Github Action](#github-action)
- [Installing package from a git url](#installing-package-from-a-git-url)
- [Adding types with JSDoc](#adding-types-with-jsdoc)
- [Manage dependencies types](#manage-dependencies-types)
  - [1. NPM from DefinitelyTyped](#1-npm-from-definitelytyped)
  - [2. Vendor type declarations](#2-vendor-type-declarations)
- [Rules for optimal type declarations and documentation](#rules-for-optimal-type-declarations-and-documentation)
  - [1. Commonjs default exports](#1-commonjs-default-exports)
  - [2. Commons js named exports](#2-commons-js-named-exports)
  - [3. Use a `types.d.ts` file](#3-use-a-typesdts-file)
  - [4. JSDoc comments bad parsing](#4-jsdoc-comments-bad-parsing)
  - [5. Always put your `@typedef` at the top of file](#5-always-put-your-typedef-at-the-top-of-file)
- [Must read references](#must-read-references)
- [Resources](#resources)

## Getting Started

Add a `tsconfig.json` to your repo that extends the default aegir ts config:

```json
{
  "extends": "aegir/src/config/tsconfig.aegir.json",
  "compilerOptions": {
    "outDir": "dist",
    "emitDeclarationOnly": true
  },
  "include": [
    "src",
    "test"
  ]
}
```

Add types configuration to your package.json:
```json
"types": "dist/src/index.d.ts",
```
`types` will tell `tsc` where to look for the entry point type declarations.

When a packages needs to allow type imports other than the entry point, you can use this workaround:
```json
"typesVersions": {
  "*": {
    "src/*": [
      "dist/src/*",
      "dist/src/*/index"
    ],
    "src/": [
      "dist/src/index"
    ]
  }
}
```
`typeVersions` will tell `tsc` where to look for every other files inside the `src` folder. Note: This might get smaller when this [issue](https://github.com/microsoft/TypeScript/issues/41284) is resolved or a proper way is introduced.

> Use this hack only if you really need it, this might change from the TS side at any time and break type checks.

## Github Action

To run the typechecker in the CI you can use this action https://github.com/Gozala/typescript-error-reporter-action and you will get the errors reported inline with the code.

## Installing package from a git url
When installing a dependency from a git url (ie. PRs depending on other PRs) the types won't be packed in. To fix this you need to add a npm script called `prepare` to run `aegir build`.

```json
"scripts": {
    "prepare": "aegir build --no-bundle"
},
```
> `yarn` needs a .npmignore file to properly install dependencies with `prepare` scripts that create extra files that need to be packed in.



## Adding types with JSDoc

Typescript can infer lots of the types without any help, but you can improve your code types by using just JSDoc for that follow the official TS documentation https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html.

## Manage dependencies types
When dependencies don't publish types you have two options.

### 1. NPM from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
```bash
npm install @types/tape
```

### 2. Vendor type declarations
Create a `types` folder at the root of your project to keep all your vendored types. Inside create one folder per dependency using the dependency name as the folder name and inside a create `index.d.ts` file with the types.

Tell TS where to look for types when a package doesn't publish them.
```json
"compilerOptions": {
  "baseUrl": "./",
  "paths": {
    "*": ["./types/*"]
  }
}
"include": [
  ...
  "types"
]
```

> Scoped packages folder name need to use `__` instead of `/`, ie. the folder for `@pre-bundle/tape` would be `pre-bundle__tape`.

Aegir will copy the types folder to the `dist` folder (ie. `dist/types`) when you build or run the types typescript preset. This way all your types, vendored and from source, will be published without broken imports.

Reference: https://github.com/voxpelli/types-in-js/discussions/7#discussion-58634


## Rules for optimal type declarations and documentation

This list is a WIP, more rules will be added as we identify them.

### 1. Commonjs default exports
When using `commonjs` modules, only use default exports when exporting a single `class`.

```js
// GOOD

class IPFS {}

module.exports = IPFS

// GOOD
IPFS.hash = ()=>{}

module.exports = IPFS

// BAD
function hash() {}

module.exports = hash

// REALLY BAD

function hash() {}
function hash2() {}

module.exports = hash
exports.hash2 = hash2


```

### 2. Commons js named exports
When using `commonjs` modules, always use named exports if you want to export multiple references.
```js
// GOOD
function hash() {}
function hash2() {}
class IPFS {}
module.exports = {
    IPFS
    hash,
    hash2,
    ...
}

// BAD
exports.hash2 = hash2() {}
exports.hash = hash() {}
exports.IPFS = IPFS
```

### 3. Use a `types.d.ts` file
When writing types JSDoc can sometimes be cumbersome, impossible, it can output weird type declarations or even broken documentation. Most of these problems can be solved by defining some complex types in typescript in a `types.d.ts` file.

```ts
// types.d.ts
export type IntersectionType = Type1 & Type2
```

```js
// index.js
/** @type { import('./types.js').IntersectionType } */
const list
```
You can also organize your source types in the same way as [vendored types](#vendor-type-declarations).

Create a folder inside the `types` folder called `self` or the package name. Then you can import like you would a third party type.

```js
/**
 * @typedef {import('self').CustomOptions} CustomOptions
 * /
```


### 4. JSDoc comments bad parsing
Some TS tooling may have problems parsing comments if they are not very well divided.

```ts

// BAD - the base typedef can be parsed as a comment for Square
/**
 *
 * @typedef {import('./index') Base} Base
 */

class Square {}


// GOOD
/** @typedef {import('./index') Base} Base */

/**
 * Cool Square class
 * @class
 */
class Square {}
```

### 5. Always put your `@typedef` at the top of file
**Keep in mind rule nº 4 above**

Check https://github.com/ipfs/community/pull/474

```js


const { Adapter, utils } = require('interface-datastore')
const fs = require('fs')

/**
 * @typedef {import('interface-datastore/src/types').Datastore} Datastore
 * @typedef {import("interface-datastore/src/types").Options} Options
 * @typedef {import("interface-datastore/src/types").Batch} Batch
 * @typedef {import('interface-datastore/src/key')} Key
 * @typedef {import('interface-datastore/src/adapter').Query} Query
 * @typedef {import('./types.js').KeyTransform} KeyTransform
 */
```

## Must read references
[10 Insights from Adopting TypeScript at Scale](https://www.techatbloomberg.com/blog/10-insights-adopting-typescript-at-scale/)
[Typescript official performance notes](https://github.com/microsoft/TypeScript/wiki/Performance)
[TypeScript: Don’t Export const enums](https://ncjamieson.com/dont-export-const-enums/)
[TypeScript: Prefer Interfaces](https://ncjamieson.com/prefer-interfaces/)
[Typescript Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## Resources
[TS with JSDoc Discussions](https://github.com/voxpelli/types-in-js)
[Tackling Typescript](https://exploringjs.com/tackling-ts/toc.html)
[Effective Typescript](https://effectivetypescript.com/)