# Documentation for JSDoc based TS types

## Getting Started

Add a `tsconfig.json` to your repo:
```bash
aegir ts -p config > tsconfig.json
```

Add types configuration to your package.json:
```json
"typesVersions": {
  "*": { "src/*": ["dist/src/*", "dist/src/*/index"] }
},
```
`types` will tell `tsc` where to look for the entry point type declarations and `typeVersions` for every other files inside the `src` folder.

> The `ts` command follows aegir folder conventions, source code inside `./src`, test inside `./test` and documentation inside `./docs`.


## CLI `ts` command

Run `aegir ts --help` and check the help text. There's presets for common TS use cases.

```md
Presets:
`check`       Runs the type checker with your local config and doesn't not emit output.
`types`       Emits type declarations for `['src/**/*', 'package.json']` to `dist` folder.
`docs`        Generates documentation based on type declarations to the `docs` folder.
`config`      Prints base config to stdout.
```
## Github Action

To run the typechecker in the CI you can use this action https://github.com/Gozala/typescript-error-reporter-action and you will get the errors reported inline with the code. 

## Adding types with JSDoc

Typescript can infere lots of the types without any help, but you can improve your code types by using just JSDoc for that follow the official TS documentation https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html. 

### Rules for optimal type declarations and documentation

This list is a WIP, more rules will be added as we identify them.

#### 1. Commonjs default exports
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

#### 2. Commons js named exports
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

#### 3. Use a `types.ts` file
When writing types JSDoc can sometimes be cumbersome, impossible, it can output weird type declarations or even broken documentation. Most of these problems can be solved by defining some complex types in typescript in a `types.ts` file.

```ts
// types.ts
export type IntersectionType = Type1 & Type2
```

```js
// index.js
/** @type { import('./types').IntersectionType } */
const list
```

#### 4. JSDoc comments bad parsing
Some TS tooling may have problems parsing comments if they are not very well divided.

```ts

// BAD - the base typedef can be parsed as a comment for Square

/** @typedef {import('./index') Base} Base */

class Square {}


// GOOD 
/** @typedef {import('./index') Base} Base */

/**
 * Cool Square class
 * @class
 */
class Square {}

// GOOD

class Square {}

module.export = Square

/** @typedef {import('./index') Base} Base */

```