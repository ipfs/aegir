<a name="12.2.0"></a>
# [12.2.0](https://github.com/ipfs/aegir/compare/v12.1.3...v12.2.0) (2017-11-21)


### Features

* **docs:** add format flag to which selects docs output formats  ([456858f](https://github.com/ipfs/aegir/commit/456858f))



<a name="12.1.3"></a>
## [12.1.3](https://github.com/ipfs/aegir/compare/v12.1.2...v12.1.3) (2017-10-31)


### Features

* add timeout to coverage ([#171](https://github.com/ipfs/aegir/issues/171)) ([f498ff3](https://github.com/ipfs/aegir/commit/f498ff3))



<a name="12.1.2"></a>
## [12.1.2](https://github.com/ipfs/aegir/compare/v12.1.1...v12.1.2) (2017-10-30)


### Bug Fixes

* typo ([#168](https://github.com/ipfs/aegir/issues/168)) ([654bbbd](https://github.com/ipfs/aegir/commit/654bbbd))
* use mocha@4 compatible karma-mocha reporter ([9ddadf9](https://github.com/ipfs/aegir/commit/9ddadf9))


### Features

* add timeout flag for mocha runs and increase default to 5000 ([f6b10d4](https://github.com/ipfs/aegir/commit/f6b10d4))
* **test-browser:** add flag to allow enabling and disabling of CORS ([c159534](https://github.com/ipfs/aegir/commit/c159534))



<a name="12.1.1"></a>
## [12.1.1](https://github.com/ipfs/aegir/compare/v12.1.0...v12.1.1) (2017-10-25)


### Bug Fixes

* add exit option back to fix buggy tests ([819dacb](https://github.com/ipfs/aegir/commit/819dacb))



<a name="12.1.0"></a>
# [12.1.0](https://github.com/ipfs/aegir/compare/v12.0.8...v12.1.0) (2017-10-22)


### Bug Fixes

* use os independent test execution ([2e1639c](https://github.com/ipfs/aegir/commit/2e1639c))
* use windows compatible findup module ([a91119c](https://github.com/ipfs/aegir/commit/a91119c))



<a name="12.0.8"></a>
## [12.0.8](https://github.com/ipfs/aegir/compare/v12.0.7...v12.0.8) (2017-09-16)



<a name="12.0.7"></a>
## [12.0.7](https://github.com/ipfs/aegir/compare/v12.0.6...v12.0.7) (2017-09-16)


### Bug Fixes

* filter env vars ([78b36b2](https://github.com/ipfs/aegir/commit/78b36b2))



<a name="12.0.6"></a>
## [12.0.6](https://github.com/ipfs/aegir/compare/v12.0.5...v12.0.6) (2017-09-05)


### Bug Fixes

* **release:** do not overwrite changelog ([58677a4](https://github.com/ipfs/aegir/commit/58677a4))



<a name="12.0.5"></a>
## [12.0.5](https://github.com/ipfs/aegir/compare/v12.0.4...v12.0.5) (2017-09-05)


### Bug Fixes

* **test:** custom jest environemnt ([b362313](https://github.com/ipfs/aegir/commit/b362313)), closes [#153](https://github.com/ipfs/aegir/issues/153)



<a name="12.0.4"></a>
## [12.0.4](https://github.com/ipfs/aegir/compare/v12.0.3...v12.0.4) (2017-09-05)


### Features

* **coverage:** add ignore option ([4811444](https://github.com/ipfs/aegir/commit/4811444))



<a name="12.0.3"></a>
## [12.0.3](https://github.com/ipfs/aegir/compare/v12.0.2...v12.0.3) (2017-09-04)


### Bug Fixes

* **build:** correct browser builds ([e9ceb97](https://github.com/ipfs/aegir/commit/e9ceb97))
* **test:** add `<rootDir>` to src to ignore patterns for jest ([0e1bb1e](https://github.com/ipfs/aegir/commit/0e1bb1e))



<a name="12.0.2"></a>
## [12.0.2](https://github.com/ipfs/aegir/compare/v12.0.1...v12.0.2) (2017-09-04)


### Bug Fixes

* **coverage:** handle hooks properly ([ec15fde](https://github.com/ipfs/aegir/commit/ec15fde))



<a name="12.0.1"></a>
## [12.0.1](https://github.com/ipfs/aegir/compare/v12.0.0...v12.0.1) (2017-08-30)


### Bug Fixes

* **coverage:** fix overlapping aliases ([0382f6d](https://github.com/ipfs/aegir/commit/0382f6d))



<a name="12.0.0"></a>
# [12.0.0](https://github.com/ipfs/aegir/compare/v11.0.2...v12.0.0) (2017-08-25)


### Bug Fixes

* **gitignore:** add all source files ([61ee9f4](https://github.com/ipfs/aegir/commit/61ee9f4))
* correct jest version ([2f47bb8](https://github.com/ipfs/aegir/commit/2f47bb8))
* improve package.json config ([36d231d](https://github.com/ipfs/aegir/commit/36d231d))
* **release:** fix typo ([ceae294](https://github.com/ipfs/aegir/commit/ceae294))
* **release:** missing pieces ([471184f](https://github.com/ipfs/aegir/commit/471184f))
* **test:** always use spec reporter in the browser ([5f60764](https://github.com/ipfs/aegir/commit/5f60764)), closes [#140](https://github.com/ipfs/aegir/issues/140)
* **test:** correct browser hooks ([4a2c643](https://github.com/ipfs/aegir/commit/4a2c643))
* **test:** handle various test states ([adbfa41](https://github.com/ipfs/aegir/commit/adbfa41))
* **test:** higher disconnect timeout for karma ([0976088](https://github.com/ipfs/aegir/commit/0976088))
* **webpack:** remove deprecated json-loader ([b61e7be](https://github.com/ipfs/aegir/commit/b61e7be)), closes [#137](https://github.com/ipfs/aegir/issues/137)


### Features

* **browser:** use uglify-es instead of uglify-js ([668f3ac](https://github.com/ipfs/aegir/commit/668f3ac))
* **build:** add filesizes to output ([7a6f30c](https://github.com/ipfs/aegir/commit/7a6f30c))
* **coverage:** allow for multiple provider publish ([a323017](https://github.com/ipfs/aegir/commit/a323017))
* **deps:** update chalk and webpack ([f37112c](https://github.com/ipfs/aegir/commit/f37112c))
* **eslint:** extract config into its own package ([61ad82a](https://github.com/ipfs/aegir/commit/61ad82a))
* **lint:** allow lint config via eslintrc ([dce396c](https://github.com/ipfs/aegir/commit/dce396c))
* **release:** include docs generation ([07d3554](https://github.com/ipfs/aegir/commit/07d3554))
* **test:** better interop and --files option ([5468940](https://github.com/ipfs/aegir/commit/5468940))
* add update-notifier ([fd0a6d8](https://github.com/ipfs/aegir/commit/fd0a6d8))
* better patch for this.timeout ([d4b8c31](https://github.com/ipfs/aegir/commit/d4b8c31))
* coverage on travis ([261c213](https://github.com/ipfs/aegir/commit/261c213))
* implement hooks and fix some bugs ([e0f716c](https://github.com/ipfs/aegir/commit/e0f716c))
* make parallel and timeout customizable ([4ae78ac](https://github.com/ipfs/aegir/commit/4ae78ac))
* reduce default timeout to 40s and enable it in node tests ([489fbb3](https://github.com/ipfs/aegir/commit/489fbb3))
* reduce timeout and monkeypatch this.timeout ([13894a4](https://github.com/ipfs/aegir/commit/13894a4))
* support --files on coverage and release ([9d58062](https://github.com/ipfs/aegir/commit/9d58062))
* **webpack:** include AEGIR_ prefixed env variables ([a4adb59](https://github.com/ipfs/aegir/commit/a4adb59))
* use different renderer on ci ([c4a9924](https://github.com/ipfs/aegir/commit/c4a9924))
* use jest beta version ([bfe2ae2](https://github.com/ipfs/aegir/commit/bfe2ae2))



<a name="11.0.2"></a>
## [11.0.2](https://github.com/ipfs/aegir/compare/v11.0.1...v11.0.2) (2017-05-16)


### Features

* pick the right uglify-js by commit ([75ad531](https://github.com/ipfs/aegir/commit/75ad531))



<a name="11.0.1"></a>
## [11.0.1](https://github.com/ipfs/aegir/compare/v11.0.0...v11.0.1) (2017-03-22)


### Bug Fixes

* **config:** update webpack.js to be compatible with webpack@2.3.0 ([e82ae5f](https://github.com/ipfs/aegir/commit/e82ae5f))



<a name="11.0.0"></a>
# [11.0.0](https://github.com/ipfs/aegir/compare/v10.0.0...v11.0.0) (2017-03-16)


### Bug Fixes

* **karma:** fail on empty test suite ([d2a2e6c](https://github.com/ipfs/aegir/commit/d2a2e6c)), closes [#100](https://github.com/ipfs/aegir/issues/100)
* **package:** update codecov to version 2.0.1 ([#114](https://github.com/ipfs/aegir/issues/114)) ([2014143](https://github.com/ipfs/aegir/commit/2014143))
* **package:** update gulp-git to version 2.0.0 ([a74a3dc](https://github.com/ipfs/aegir/commit/a74a3dc))
* **package:** update webpack-merge to version 4.0.0 ([34ae02c](https://github.com/ipfs/aegir/commit/34ae02c)), closes [#105](https://github.com/ipfs/aegir/issues/105)


### Features

* update all dependencies and add yarn.lock ([9508272](https://github.com/ipfs/aegir/commit/9508272))



<a name="10.0.0"></a>
# [10.0.0](https://github.com/ipfs/aegir/compare/v9.4.0...v10.0.0) (2017-02-07)


### Features

* **test:** enable tests in webworkers by default ([233708c](https://github.com/ipfs/aegir/commit/233708c))



<a name="9.4.0"></a>
# [9.4.0](https://github.com/ipfs/aegir/compare/v9.3.3...v9.4.0) (2017-01-27)


### Features

* **coverage:** add codecov to coverage providers  ([8f06c99](https://github.com/ipfs/aegir/commit/8f06c99))
* **test:** add support to run tests in web workers ([0b7a851](https://github.com/ipfs/aegir/commit/0b7a851))
* **test:** finish webworker test implementation ([ea0a8b1](https://github.com/ipfs/aegir/commit/ea0a8b1))



<a name="9.3.3"></a>
## [9.3.3](https://github.com/ipfs/aegir/compare/v9.3.2...v9.3.3) (2017-01-21)


### Bug Fixes

* **webpack:** fix typo in browserify-zlib-next alias ([44ee5a6](https://github.com/ipfs/aegir/commit/44ee5a6))



<a name="9.3.2"></a>
## [9.3.2](https://github.com/ipfs/aegir/compare/v9.3.1...v9.3.2) (2017-01-19)


### Features

* **deps:** use new browserify-zlib-next package ([68810c1](https://github.com/ipfs/aegir/commit/68810c1))



<a name="9.3.1"></a>
## [9.3.1](https://github.com/ipfs/aegir/compare/v9.3.0...v9.3.1) (2017-01-19)


### Bug Fixes

* **deps:** add correct browserify-zlib dependency ([78b8cbd](https://github.com/ipfs/aegir/commit/78b8cbd))



<a name="9.3.0"></a>
# [9.3.0](https://github.com/ipfs/aegir/compare/v9.2.2...v9.3.0) (2016-12-13)


### Bug Fixes

* **build:** remove deprecated dedupe plugin ([b4834ba](https://github.com/ipfs/aegir/commit/b4834ba))
* **lint:** ignore nested `node_modules` dirs ([f3ae7e6](https://github.com/ipfs/aegir/commit/f3ae7e6))


### Features

* **deps:** upgrade to the latest webpack beta.28 ([bdd4079](https://github.com/ipfs/aegir/commit/bdd4079))
* **docs:** add generic intro template ([2d0fba0](https://github.com/ipfs/aegir/commit/2d0fba0))



<a name="9.2.2"></a>
## [9.2.2](https://github.com/ipfs/aegir/compare/v9.2.1...v9.2.2) (2016-12-12)


### Bug Fixes

* **release:** actual run release:docs task ([5e1b076](https://github.com/ipfs/aegir/commit/5e1b076))



<a name="9.2.1"></a>
## [9.2.1](https://github.com/ipfs/aegir/compare/v9.2.0...v9.2.1) (2016-12-09)


### Bug Fixes

* **docs:** use different module for publishing to gh-pages ([601525f](https://github.com/ipfs/aegir/commit/601525f)), closes [#79](https://github.com/ipfs/aegir/issues/79)



<a name="9.2.0"></a>
# [9.2.0](https://github.com/ipfs/aegir/compare/v9.1.2...v9.2.0) (2016-12-08)


### Bug Fixes

* **test:** only run sauce labs if access key is available ([267830a](https://github.com/ipfs/aegir/commit/267830a)), closes [#76](https://github.com/ipfs/aegir/issues/76)


### Features

* add aegir-docs  ([1d82ce7](https://github.com/ipfs/aegir/commit/1d82ce7)), closes [#77](https://github.com/ipfs/aegir/issues/77)
* add possibility to specify a custom entry file ([258f82f](https://github.com/ipfs/aegir/commit/258f82f))



<a name="9.1.2"></a>
## [9.1.2](https://github.com/ipfs/aegir/compare/v9.1.1...v9.1.2) (2016-11-15)


### Bug Fixes

* adjust loader config for webpack@2.1.0-beta.26 ([bb04801](https://github.com/ipfs/aegir/commit/bb04801))



<a name="9.1.1"></a>
## [9.1.1](https://github.com/ipfs/aegir/compare/v9.1.0...v9.1.1) (2016-11-04)


### Bug Fixes

* **test:** remove webpack verbose logging ([368c5ba](https://github.com/ipfs/aegir/commit/368c5ba))
* **webpack:** workaround for outdated http-browserify ([10d6c15](https://github.com/ipfs/aegir/commit/10d6c15))



<a name="9.1.0"></a>
# [9.1.0](https://github.com/ipfs/aegir/compare/v9.0.1...v9.1.0) (2016-11-03)


### Features

* **test:** new fixture loading mechanism ([b007e00](https://github.com/ipfs/aegir/commit/b007e00))



<a name="9.0.1"></a>
## [9.0.1](https://github.com/ipfs/aegir/compare/v9.0.0...v9.0.1) (2016-10-31)


### Features

* only run sauce labs tests when SAUCE=true ([bb2e575](https://github.com/ipfs/aegir/commit/bb2e575))



<a name="9.0.0"></a>
# [9.0.0](https://github.com/ipfs/aegir/compare/v8.1.2...v9.0.0) (2016-10-27)


### Features

* **build:** stop transpiling for nodejs ([0f7d392](https://github.com/ipfs/aegir/commit/0f7d392))
* drop special webpack configs ([6a726b2](https://github.com/ipfs/aegir/commit/6a726b2))
* **test:** add sauce labs support ([7af165f](https://github.com/ipfs/aegir/commit/7af165f))
* **test:** drop phantomjs from testing ([3299ce1](https://github.com/ipfs/aegir/commit/3299ce1))
* stop transpiling and use uglify-harmony ([a83f8dd](https://github.com/ipfs/aegir/commit/a83f8dd))



<a name="8.1.2"></a>
## [8.1.2](https://github.com/ipfs/aegir/compare/v8.1.1...v8.1.2) (2016-09-26)


### Performance Improvements

* only load needed gulp scripts in bins ([c4b8c7f](https://github.com/ipfs/aegir/commit/c4b8c7f))
* use gulp-mocha ([a2d428e](https://github.com/ipfs/aegir/commit/a2d428e))
* use manual inlined requires ([e9472c4](https://github.com/ipfs/aegir/commit/e9472c4))



<a name="8.1.1"></a>
## [8.1.1](https://github.com/ipfs/aegir/compare/v8.1.0...v8.1.1) (2016-09-22)


### Bug Fixes

* **webpack:** upgrade to beta.25 ([01ae928](https://github.com/ipfs/aegir/commit/01ae928))



<a name="8.1.0"></a>
# [8.1.0](https://github.com/ipfs/aegir/compare/v8.0.1...v8.1.0) (2016-09-13)


### Features

* **lint:** enforce curlies ([c76868c](https://github.com/ipfs/aegir/commit/c76868c)), closes [#56](https://github.com/ipfs/aegir/issues/56)
* **webpack:** shim ursa ([d4c10e6](https://github.com/ipfs/aegir/commit/d4c10e6))



<a name="8.0.1"></a>
## [8.0.1](https://github.com/ipfs/aegir/compare/v8.0.0...v8.0.1) (2016-09-08)


### Features

* Add a way to disable PhantomJS testing ([#54](https://github.com/ipfs/aegir/issues/54)) ([25dfaf7](https://github.com/ipfs/aegir/commit/25dfaf7))



<a name="8.0.0"></a>
# [8.0.0](https://github.com/ipfs/aegir/compare/v7.0.1...v8.0.0) (2016-09-06)


### Bug Fixes

* stop gulp tasks before exiting ([bd5773b](https://github.com/ipfs/aegir/commit/bd5773b)), closes [#52](https://github.com/ipfs/aegir/issues/52)



<a name="7.0.1"></a>
## [7.0.1](https://github.com/ipfs/aegir/compare/v7.0.0...v7.0.1) (2016-08-23)


### Bug Fixes

* improve babe-transform handling ([38fe6c2](https://github.com/ipfs/aegir/commit/38fe6c2))



<a name="7.0.0"></a>
# [7.0.0](https://github.com/ipfs/aegir/compare/v6.0.1...v7.0.0) (2016-08-19)


### Features

* **build:** add stats flag ([8046edb](https://github.com/ipfs/aegir/commit/8046edb))



<a name="6.0.1"></a>
## [6.0.1](https://github.com/ipfs/aegir/compare/v6.0.0...v6.0.1) (2016-08-09)


### Bug Fixes

* **webpack:** only enable dedupe in production ([050ba21](https://github.com/ipfs/aegir/commit/050ba21)), closes [#46](https://github.com/ipfs/aegir/issues/46)



<a name="6.0.0"></a>
# [6.0.0](https://github.com/ipfs/aegir/compare/v5.0.1...v6.0.0) (2016-08-04)


### Features

* do not depend on babel-polyfill ([db11d56](https://github.com/ipfs/aegir/commit/db11d56)), closes [#36](https://github.com/ipfs/aegir/issues/36)
* **lint:** restrict nesting to avoid callback hell ([0f11049](https://github.com/ipfs/aegir/commit/0f11049)), closes [#43](https://github.com/ipfs/aegir/issues/43)
* **release:** add --no-changelog option ([ced51fe](https://github.com/ipfs/aegir/commit/ced51fe))
* **release:** add changelog generation ([44896e4](https://github.com/ipfs/aegir/commit/44896e4))
* **release:** add github release ([564e1d5](https://github.com/ipfs/aegir/commit/564e1d5))
* **webpack:** enable dedupe plugin ([04c24e9](https://github.com/ipfs/aegir/commit/04c24e9))


### BREAKING CHANGES

* This can break browser builds and tests and needs to be tested
carefully when upgrading.



<a name="5.0.1"></a>
## [5.0.1](https://github.com/ipfs/aegir/compare/v5.0.0...v5.0.1) (2016-08-03)


### Bug Fixes

* add missing istanbul dependency ([973f2c2](https://github.com/ipfs/aegir/commit/973f2c2))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/ipfs/aegir/compare/v4.0.0...v5.0.0) (2016-08-03)


### Features

* upgrade dependencies ([80eb572](https://github.com/ipfs/aegir/commit/80eb572))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/ipfs/aegir/compare/v3.2.0...v4.0.0) (2016-07-07)



<a name="3.2.0"></a>
# [3.2.0](https://github.com/ipfs/aegir/compare/v3.1.1...v3.2.0) (2016-05-29)


### Bug Fixes

* revert umd addition ([4d66846](https://github.com/ipfs/aegir/commit/4d66846))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/ipfs/aegir/compare/v3.1.0...v3.1.1) (2016-05-26)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/ipfs/aegir/compare/v3.0.5...v3.1.0) (2016-05-26)


### Bug Fixes

* minify the index.min file ([7e1dd3b](https://github.com/ipfs/aegir/commit/7e1dd3b))



<a name="3.0.5"></a>
## [3.0.5](https://github.com/ipfs/aegir/compare/v3.0.4...v3.0.5) (2016-05-23)


### Bug Fixes

* pin gulp-load-plugins ([bbbc061](https://github.com/ipfs/aegir/commit/bbbc061))



<a name="3.0.4"></a>
## [3.0.4](https://github.com/ipfs/aegir/compare/v3.0.3...v3.0.4) (2016-05-16)


### Bug Fixes

* assignment of custom config ([75ae677](https://github.com/ipfs/aegir/commit/75ae677))



<a name="3.0.3"></a>
## [3.0.3](https://github.com/ipfs/aegir/compare/v3.0.2...v3.0.3) (2016-05-16)


### Features

* custom .aegir.js config ([26ffbbd](https://github.com/ipfs/aegir/commit/26ffbbd))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/ipfs/aegir/compare/v3.0.1...v3.0.2) (2016-05-13)


### Bug Fixes

* **webpack:** transform promisify-es ([116f818](https://github.com/ipfs/aegir/commit/116f818))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/ipfs/aegir/compare/v3.0.0...v3.0.1) (2016-05-03)


### Bug Fixes

* Better polyfill handling and sourcemap support ([ae45b01](https://github.com/ipfs/aegir/commit/ae45b01))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/ipfs/aegir/compare/v2.1.2...v3.0.0) (2016-04-26)


### Bug Fixes

* Better env specific tasks ([1f26923](https://github.com/ipfs/aegir/commit/1f26923))



<a name="2.1.2"></a>
## [2.1.2](https://github.com/ipfs/aegir/compare/v2.1.1...v2.1.2) (2016-04-22)


### Bug Fixes

* **webpack:** allow tape to run ([8267357](https://github.com/ipfs/aegir/commit/8267357))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/ipfs/aegir/compare/v2.1.0...v2.1.1) (2016-04-15)


### Bug Fixes

* **coverage:** Run node hooks on coverage task ([fdab865](https://github.com/ipfs/aegir/commit/fdab865))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/ipfs/aegir/compare/v2.0.3...v2.1.0) (2016-04-14)


### Features

* **release:** Add contributors task ([40be36e](https://github.com/ipfs/aegir/commit/40be36e))
* Use gulp-spawn-mocha and add coverage publishing ([b3b5afd](https://github.com/ipfs/aegir/commit/b3b5afd))



<a name="2.0.3"></a>
## [2.0.3](https://github.com/ipfs/aegir/compare/v2.0.2...v2.0.3) (2016-04-14)


### Bug Fixes

* **build:** Transpile copied version ([e4dbc6d](https://github.com/ipfs/aegir/commit/e4dbc6d))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/ipfs/aegir/compare/v2.0.1...v2.0.2) (2016-04-14)


### Bug Fixes

* **build:** Copy all files, not only js files when building for node ([97577a3](https://github.com/ipfs/aegir/commit/97577a3))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/ipfs/aegir/compare/v2.0.0...v2.0.1) (2016-04-13)


### Bug Fixes

* Typo in webpack config ([cc927d1](https://github.com/ipfs/aegir/commit/cc927d1))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ipfs/aegir/compare/v1.0.1...v2.0.0) (2016-04-13)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/ipfs/aegir/compare/v1.0.0...v1.0.1) (2016-04-11)


### Bug Fixes

* Bring back tagging. ([a78a1d4](https://github.com/ipfs/aegir/commit/a78a1d4)), closes [#6](https://github.com/ipfs/aegir/issues/6)


### Features

* Add release no-build ([0cb7035](https://github.com/ipfs/aegir/commit/0cb7035))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/ipfs/aegir/compare/v1.0.0-beta.0...v1.0.0) (2016-04-07)



<a name="1.0.0-beta.0"></a>
# 1.0.0-beta.0 (2016-03-21)



