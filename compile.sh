#!/bin/bash

node misc/cmdPatch.js
rm -rf dist tmp
mkdir tmp
cp ./node_modules/path-platform/path.js ./tmp/path_patched.js
patch ./tmp/path_patched.js ./misc/pathPatch.patch
for m in electron hipchat-notifier loggly mailgun-js nodemailer should sinon-restore slack-node yamlparser; do
  echo "module.exports = global.require('""$m""')" > tmp/lazyload.$m.js
done
webpack
