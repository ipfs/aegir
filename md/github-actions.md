Create a new file called `main.yml` inside `.github/workflows` with the following content:

```yml
name: ci
on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: npm install
    - run: npx aegir lint
    - run: npx aegir build
    - run: npx aegir dep-check
    - run: npx aegir doc-check
    - uses: ipfs/aegir/actions/bundle-size@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
  test-node:
    needs: check
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest, macos-latest]
        node: [14, 16]
      fail-fast: true
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node }}
      - run: npm install
      - run: npx aegir test -t node --bail --cov
      - uses: codecov/codecov-action@v1
  test-chrome:
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: microsoft/playwright-github-action@v1
      - run: npm install
      - run: npx aegir test -t browser --bail --cov
      - run: npx aegir test -t webworker --bail
      - uses: codecov/codecov-action@v1
  test-firefox:
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: microsoft/playwright-github-action@v1
      - run: npm install
      - run: npx aegir test -t browser -t webworker --bail -- --browser firefox
  test-webkit:
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: microsoft/playwright-github-action@v1
      - run: npm install
      - run: npx aegir test -t browser -t webworker --bail -- --browser webkit
  test-electron-main:
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npx xvfb-maybe aegir test -t electron-main --bail
  test-electron-renderer:
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npx xvfb-maybe aegir test -t electron-renderer --bail
```