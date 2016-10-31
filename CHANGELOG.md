<a name="9.0.1"></a>
## [9.0.1](https://github.com/dignifiedquire/aegir/compare/v9.0.0...v9.0.1) (2016-10-31)


### Features

* only run sauce labs tests when SAUCE=true ([bb2e575](https://github.com/dignifiedquire/aegir/commit/bb2e575))



<a name="9.0.0"></a>
# [9.0.0](https://github.com/dignifiedquire/aegir/compare/v8.1.2...v9.0.0) (2016-10-27)


### Features

* **build:** stop transpiling for nodejs ([0f7d392](https://github.com/dignifiedquire/aegir/commit/0f7d392))
* drop special webpack configs ([6a726b2](https://github.com/dignifiedquire/aegir/commit/6a726b2))
* **test:** add sauce labs support ([7af165f](https://github.com/dignifiedquire/aegir/commit/7af165f))
* **test:** drop phantomjs from testing ([3299ce1](https://github.com/dignifiedquire/aegir/commit/3299ce1))
* stop transpiling and use uglify-harmony ([a83f8dd](https://github.com/dignifiedquire/aegir/commit/a83f8dd))



<a name="8.1.2"></a>
## [8.1.2](https://github.com/dignifiedquire/aegir/compare/v8.1.1...v8.1.2) (2016-09-26)


### Performance Improvements

* only load needed gulp scripts in bins ([c4b8c7f](https://github.com/dignifiedquire/aegir/commit/c4b8c7f))
* use gulp-mocha ([a2d428e](https://github.com/dignifiedquire/aegir/commit/a2d428e))
* use manual inlined requires ([e9472c4](https://github.com/dignifiedquire/aegir/commit/e9472c4))



<a name="8.1.1"></a>
## [8.1.1](https://github.com/dignifiedquire/aegir/compare/v8.1.0...v8.1.1) (2016-09-22)


### Bug Fixes

* **webpack:** upgrade to beta.25 ([01ae928](https://github.com/dignifiedquire/aegir/commit/01ae928))



<a name="8.1.0"></a>
# [8.1.0](https://github.com/dignifiedquire/aegir/compare/v8.0.1...v8.1.0) (2016-09-13)


### Features

* **lint:** enforce curlies ([c76868c](https://github.com/dignifiedquire/aegir/commit/c76868c)), closes [#56](https://github.com/dignifiedquire/aegir/issues/56)
* **webpack:** shim ursa ([d4c10e6](https://github.com/dignifiedquire/aegir/commit/d4c10e6))



<a name="8.0.1"></a>
## [8.0.1](https://github.com/dignifiedquire/aegir/compare/v8.0.0...v8.0.1) (2016-09-08)


### Features

* Add a way to disable PhantomJS testing ([#54](https://github.com/dignifiedquire/aegir/issues/54)) ([25dfaf7](https://github.com/dignifiedquire/aegir/commit/25dfaf7))



<a name="8.0.0"></a>
# [8.0.0](https://github.com/dignifiedquire/aegir/compare/v7.0.1...v8.0.0) (2016-09-06)


### Bug Fixes

* stop gulp tasks before exiting ([bd5773b](https://github.com/dignifiedquire/aegir/commit/bd5773b)), closes [#52](https://github.com/dignifiedquire/aegir/issues/52)



<a name="7.0.1"></a>
## [7.0.1](https://github.com/dignifiedquire/aegir/compare/v7.0.0...v7.0.1) (2016-08-23)


### Bug Fixes

* improve babe-transform handling ([38fe6c2](https://github.com/dignifiedquire/aegir/commit/38fe6c2))



<a name="7.0.0"></a>
# [7.0.0](https://github.com/dignifiedquire/aegir/compare/v6.0.1...v7.0.0) (2016-08-19)


### Features

* do not depend on babel-polyfill ([db11d56](https://github.com/dignifiedquire/aegir/commit/db11d56)), closes [#36](https://github.com/dignifiedquire/aegir/issues/36)
* **build:** add stats flag ([8046edb](https://github.com/dignifiedquire/aegir/commit/8046edb))
* **release:** add --no-changelog option ([ced51fe](https://github.com/dignifiedquire/aegir/commit/ced51fe))
* **release:** add changelog generation ([44896e4](https://github.com/dignifiedquire/aegir/commit/44896e4))
* **release:** add github release ([564e1d5](https://github.com/dignifiedquire/aegir/commit/564e1d5))


### BREAKING CHANGES

* This can break browser builds and tests and needs to be tested
carefully when upgrading.



<a name="2.0.0"></a>
## 2.0.0 (2016-04-13)

* **breaking**: Rename to `aegir`

<a name="1.0.1"></a>
## 1.0.1 (2016-04-11)

* **feat** Add new command options to release task
  * `aegir-release node`: for node only modules
  * `aegir-release browser`: for browser only modules
  * `aegir-release no-build`: for cli modules that do not need any build
* **feat** Add new command options to build task
  * `aegir-build node`: for node only modules
  * `aegir-build browser`: for browser only modules
* **feat** Tag releases with a git tag

<a name="1.0.0"></a>
## 1.0.0 (2016-04-07)

Initial Release
