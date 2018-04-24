#!/bin/bash

rm -rf dist tmp
mkdir tmp

node misc/cmdPatch.js
patch ./cli_patched.js ./misc/cli.patch
node misc/uglifyToolsPreprocess.js
cp ./node_modules/path-platform/path.js ./tmp/path_patched.js
patch ./tmp/path_patched.js ./misc/pathPatch.patch
cp ./node_modules/any-observable/register.js ./tmp/register_patched.js
patch ./tmp/register_patched.js ./misc/register.patch
webpack --config webpack.dev.js
