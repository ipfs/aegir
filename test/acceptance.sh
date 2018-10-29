#! /usr/bin/env bash

# Acceptance test for making sure aegir works as we want it to

set -e

# Debug
# set -x

echo "## Creating a link to current AEgir"
npm link

echo "## Creating test directory"
TEST_DIR=$(mktemp -d)

cd $TEST_DIR

echo "## Cloning aegir-test-repo"
git clone https://github.com/ipfs/aegir-test-repo

cd aegir-test-repo

echo "## Installing dependencies for aegir-test-repo"
npm install

echo "## Linking current AEgir into aegir-test-repo"
npm link aegir

echo "## Running build command"
npm run build

echo "## Making sure right files were created"

if [ ! -d "dist" ]; then
    echo "'dist/' directory wasn't created correctly "
    exit 1
fi

if [ ! -e "dist/index.js" ]; then
    echo "'dist/index.js' file wasn't created correctly "
    exit 1
fi

if [ ! -e "dist/index.min.js" ]; then
    echo "'dist/index.min.js' file wasn't created correctly "
    exit 1
fi

if [ ! -e "dist/index.min.js.map" ]; then
    echo "'dist/index.min.js.map' file wasn't created correctly "
    exit 1
fi

echo "## Cleaning up"
rm -rf $TEST_DIR
