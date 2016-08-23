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
