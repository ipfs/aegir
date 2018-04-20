#!/bin/bash

rm -rf dist tmp
mkdir tmp

node misc/cmdPatch.js
c=$(cat cli_patched.js)
echo "'use strict'
$c
" > cli_patched.js
node misc/uglifyToolsPreprocess.js
cp ./node_modules/path-platform/path.js ./tmp/path_patched.js
patch ./tmp/path_patched.js ./misc/pathPatch.patch
cp ./node_modules/any-observable/register.js ./tmp/register_patched.js
patch ./tmp/register_patched.js ./misc/register.patch
for m in electron hipchat-notifier loggly mailgun-js nodemailer should sinon-restore slack-node yamlparser; do
  echo "module.exports = global.require('""$m""')" > tmp/lazyload.$m.js
done
webpack --config webpack.dev.js
