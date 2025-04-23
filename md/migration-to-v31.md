# Migration Guide v31

## `typeVersions` should not be used unless strictly necessary

We started `typeVersions` a while a ago as an hack to allow deep type imports inside the `src` folder, but this makes the TS compiler output wrong import statement in the `.d.ts` .

Look into the link bellow for more info:

- [https://github.com/ipfs/aegir/pull/717](https://github.com/ipfs/aegir/pull/717)
- [https://github.com/ipfs/aegir/blob/master/md/ts-jsdoc.md#getting-started](https://github.com/ipfs/aegir/blob/master/md/ts-jsdoc.md#getting-started)

Actions:

- Remove typeVersions and do a major release

## `aegir ts -p docs` was removed in favor of `aegir docs`

More info in this PR [https://github.com/ipfs/aegir/pull/727](https://github.com/ipfs/aegir/pull/727)

Actions:

- Change your script to the new command

## `aegir docs` has a new flag

The docs command has a new flag `entryPoint` to setup Typedoc, the defaults should work for most repos.

Actions:

- If your repo doesn't follow the standard structure change this new options accordingly. The default value is `src/index.js`

## The `--ts` global flag was renamed to `--ts-repo`

This flag enable support for repo using typescript, but with the work to improve configuration we ran into some name collision so this needed to be changed.

Actions:

- Change your scripts or configuration to the new flag

> This is a global flag, you can define it in the configuration file once and all the commands will use it

## Old npm dependencies semver linting removed

We had this manual rule for a long time, but npm evolved and the current behavior is exactly what this rule enforced.

No action necessary

## Config property `bundlesize.maxSize` removed

Actions:

- Update your config to use

```jsx
{
  build: {
	  bundlesizeMax: '100kb'
  }
}
```

## `types.ts` should not be used

We were using `.ts` files to write complex types instead of using just JSDocs, but this makes the TS compiler parse these files as code files instead of been just types files and that causes problems in the types generated.

Importing class types from `.js` files into `.ts` files generates the final `.d.ts` with wrong import statements to the source files instead of the types files.

Actions:

- Change the extension of all your `.ts` files to `.d.ts`

The ts command will copy all `.d.ts` inside the `src` folder to the `dist` folder automatically, and there's two new options to configure custom paths when copying files.

More info here [https://github.com/ipfs/aegir/blob/master/md/ts-jsdoc.md#3-use-a-typesdts-file](https://github.com/ipfs/aegir/blob/master/md/ts-jsdoc.md#3-use-a-typesdts-file) and here `aegir ts --help`

## `--node` flag removed

This flag was used to tell webpack to inject polyfills for node globals and builtins, this is no longer supported because we use esbuild now.

Actions:

- remove this flag from your scripts and configuration
- use your aegir configuration file to setup the bundler for the globals and builtin your code needs

```jsx
// file: node-globals.js
// @ts-nocheck
export const { Buffer } = require('buffer')
export const process = require('process/browser')

// file: .aegir.js
const esbuild = {
  // this will inject all the named exports from 'node-globals.js' as globals
  inject: [path.join(__dirname, '../../scripts/node-globals.js')],
  plugins: [
    {
      name: 'node built ins', // this will make the bundler resolve node builtins to the respective browser polyfill
      setup (build) {
        build.onResolve({ filter: /^stream$/ }, () => {
          return { path: require.resolve('readable-stream') }
        })
      }
    }
  ]
}

module.exports = {
  test: {
    browser :{
      config: {
        buildConfig: esbuild
      }
    }
  },
  build: {
    config: esbuild
  }
}
```

- test your browser bundle especially for `process` usage
    - the bundler will tell about unresolved packages like `require('fs')` and other errors
    - running the browser tests will tell you about node globals that don't exist like `Buffer`
    - `process` is special because it's polyfilled by the test runner but not by the bundler in `aegir build`
        - `aegir build` only define the var `global` and `process.env.NODE_ENV` if you code needs process.nextTick etc you need to polyfill the full process object

## Loading fixtures for browser tests

The new browser test runner automatically serves the current folder (`process.cwd()`) to be accessible through HTTP.

If you need to customize the folder to be served by the test runner use this config option `test.browser.config.assets`

## Running tests in the browser

Check the options for the new test runner here [https://github.com/hugomrdias/playwright-test#options](https://github.com/hugomrdias/playwright-test#options) these be forward directly from aegir

Actions:

- change from `aegir test -t browser -- --browsers FirefoxHeadless` to `aegir test -t browser -- --browser firefox` (options are: chromium, firefox, webkit)
- debug mode `aegir test -t browser -- --debug`

## Codecov uploads

There's no need to use nyc to instrument and generate reports for codecov anymore

Action:

- just add the `--cov` flag to your tests command

## Some flags were removed from node mocha test command

- —exit check what this did here [https://mochajs.org/#-exit](https://mochajs.org/#-exit), if you really need this (you shouldn't!) you can forward from aegir  `aegir test -t node -- --exit`
- —invert this flag was mute because we didn't support the —fgrep flag, as always you can still forward it to mocha
- —verbose flag was removed mocha doesn't support it anymore
- —color was removed we always want pretty stuff 😂
- —parallel was removed never worked

## `fixtures` download util was moved to the utils folder

Actions:

- update your requires from `require('aegir/fixtures')` to `require('aegir/utils/fixture')`

## git-validate removed from  dependencies

Actions:

- you need to use git-validate or husky in your repo to continue using git hooks

## commit-lint command removed

We already discussed the usage of commit-lint and decided to stop using it.

Actions:

- remove commit-lint from your scripts

## Hooks

Hooks were removed in favor of two new test hooks `before` and `after`

Actions:

```jsx
// before
module.exports = {
    hooks: {
        async pre () {
            await Promise.resolve()

            return 'pre done async'
        },
        async post () {
            await Promise.resolve()

            return 'post done async'
        }
    }
};

// now
module.exports = {
    test: {
        async before (testOptions) {
           if(testOptions.runner === 'node') {
	           // run node specific setup
           }
           if(testOptions.runner === 'browser') {
	           // run browser specific setup
           }
           const server = new Server()
           await server.start()
					 return {
				     env: { SERVER_URL: server.endpoint }
             server
           }
        },
        async after (testOptions, beforeReturn) {
            await beforeReturn.server.stop()
        }
    }
};
```
