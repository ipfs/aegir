## [31.0.4](https://github.com/ipfs/aegir/compare/v31.0.3...v31.0.4) (2021-03-04)


### Bug Fixes

* fix issue with docs and build cmds ([75db962](https://github.com/ipfs/aegir/commit/75db962d461ffd243d4b2324c5bbc7c96b44ac69))



## [31.0.3](https://github.com/ipfs/aegir/compare/v31.0.2...v31.0.3) (2021-03-03)


### Bug Fixes

* skip types in the release cmd when no tsconfig ([4e4e927](https://github.com/ipfs/aegir/commit/4e4e927a60bac3ac2806191afa5db3a62141bfcb))



## [31.0.2](https://github.com/ipfs/aegir/compare/v31.0.1...v31.0.2) (2021-02-26)


### Bug Fixes

* minimize umd code in the build cmd ([6156e7c](https://github.com/ipfs/aegir/commit/6156e7c6451d2d6a3062a206a01419ba36c21720))



## [31.0.1](https://github.com/ipfs/aegir/compare/v31.0.0...v31.0.1) (2021-02-26)


### Bug Fixes

* dont concat array in the build cmd config merging ([87d4ec4](https://github.com/ipfs/aegir/commit/87d4ec4aabe6cacab66013134b751438f588fccd))



# [31.0.0](https://github.com/ipfs/aegir/compare/v30.3.0...v31.0.0) (2021-02-23)


### Bug Fixes

* fix docs paths and update deps ([#726](https://github.com/ipfs/aegir/issues/726)) ([9b7136a](https://github.com/ipfs/aegir/commit/9b7136aacd7637b406208558a4d47e19282fd4e6))
* upgrade karma ([#733](https://github.com/ipfs/aegir/issues/733)) ([1212314](https://github.com/ipfs/aegir/commit/12123143b5d75934d54cbf3736db25f97767acf7))


### Features

* copy .d.ts. to dist ([#738](https://github.com/ipfs/aegir/issues/738)) ([4002b50](https://github.com/ipfs/aegir/commit/4002b5072c6f9e5dfe67e0e5e4f22930bc81d4a6))
* rename --ts flag to --ts-repo and fix ts repo support ([#730](https://github.com/ipfs/aegir/issues/730)) ([3d54004](https://github.com/ipfs/aegir/commit/3d5400406db2c912292ddc10b98586b04a41bf5b))
* ts, build, docs and lint improvements ([#732](https://github.com/ipfs/aegir/issues/732)) ([846bb25](https://github.com/ipfs/aegir/commit/846bb25818f753bea6572194362d7bbdd90d8433))
* update typedoc and improvemnts to docs cmd ([#727](https://github.com/ipfs/aegir/issues/727)) ([1149281](https://github.com/ipfs/aegir/commit/11492815864cf352ed0bba22eaec5996361439c1))
* upgrade linter to v2.0.0 ([9f67cb9](https://github.com/ipfs/aegir/commit/9f67cb99531eda4bc0aa4f0fee0b45ebd15264c1))


### BREAKING CHANGES

* Major linter upgrade may cause errors.
* Config property `bundlesize.maxSize` is deprecated, use `build.bundlesizeMax`

* fix: improve docs cmd

- add more types
- clean code and improve Listr setup

* feat: big utils clean up

- remove unnecessary methods
- add some types
- improve `paths` export, with full paths to dist, test, src and package.json folder/file

* feat: clean lint cmd

- remove old npm deps semver version checks
- update to the new eslint api
- use a new output formatter that actually gives us links we can click and go to the errors
* old npm deps semver was removed

* fix: add types for cmd options
* `--ts` flag renamed to `--ts-repo`
* aegir ts -p docs removed use aegir docs directly



# [31.0.0-next.2](https://github.com/ipfs/aegir/compare/v31.0.0-next.1...v31.0.0-next.2) (2021-02-23)


### Bug Fixes

* release ([a1f265e](https://github.com/ipfs/aegir/commit/a1f265e3d8755450f574a3de8152b59e52c32ac1))



# [31.0.0-next.1](https://github.com/ipfs/aegir/compare/v31.0.0-next.0...v31.0.0-next.1) (2021-02-23)



# [31.0.0-next.0](https://github.com/ipfs/aegir/compare/v30.3.0...v31.0.0-next.0) (2021-02-23)


### Bug Fixes

* action types ([3237ad6](https://github.com/ipfs/aegir/commit/3237ad6b40e5136a47eefd6bd50706653b5adaae))
* add migration and fix dep-check ([6dedc09](https://github.com/ipfs/aegir/commit/6dedc098e91d86b5a4a39a32d25d8cfa9ffec55f))
* add src to dep-check prod input ([ce16e7c](https://github.com/ipfs/aegir/commit/ce16e7c24a3d7d8fdc8072cb827cb6af332aba3c))
* bundle size options ([e83ac97](https://github.com/ipfs/aegir/commit/e83ac97477e64b1df479bf07ee039a443a64c566))
* check more types ([1001e00](https://github.com/ipfs/aegir/commit/1001e00070b4f6f0dc012347175a6056605c399a))
* concat dep-check ignore defaults to input ([169edb1](https://github.com/ipfs/aegir/commit/169edb15f8d450c19f824c2281ab323e8d827edc))
* dep check cmd ([4ef344f](https://github.com/ipfs/aegir/commit/4ef344f2512af2adc57a7cb742b9c840c41af7af))
* dep-check ignore ([181abe5](https://github.com/ipfs/aegir/commit/181abe54d7fe6c407a13f377ebe7bf32460be08c))
* dep-check prod input ([9bbb44e](https://github.com/ipfs/aegir/commit/9bbb44e8666e915f40dc619daaaabef598b2cde3))
* dependency check ([5bc8f64](https://github.com/ipfs/aegir/commit/5bc8f64fbc32f93ea148256f36c84af75300f25e))
* documentation ([838c165](https://github.com/ipfs/aegir/commit/838c165e1c444640976745b711d8926f3f84633b))
* electron lock, esbuild-register, node cov with c8, check cmd ([19b7301](https://github.com/ipfs/aegir/commit/19b73019cc68d4bbe731b6cc856b0f536f06a1dc))
* fix docs paths and update deps ([#726](https://github.com/ipfs/aegir/issues/726)) ([9b7136a](https://github.com/ipfs/aegir/commit/9b7136aacd7637b406208558a4d47e19282fd4e6))
* fix hooks ([98bf44d](https://github.com/ipfs/aegir/commit/98bf44d2f0e84fd4b6e927d5e59d532de09bd529))
* fix hooks ([21d5639](https://github.com/ipfs/aegir/commit/21d5639ec425d5b4a654d3e1609075e5eda25d9c))
* foward options for mocha ([26c2647](https://github.com/ipfs/aegir/commit/26c26472fb7696ef6658fb75dc294f668d461fdd))
* future node builtin check ([6917d5c](https://github.com/ipfs/aegir/commit/6917d5c67d63f5c4355c2c5f5b66d15375d9e5d3))
* move cmds to src and remove commit-lint ([ce2bc87](https://github.com/ipfs/aegir/commit/ce2bc87bbc8e31cd9cb60a59e29a663a36056bcc))
* move fixtures and export types ([b7b7ee4](https://github.com/ipfs/aegir/commit/b7b7ee4b57d0be796fb4df0ffeca2bf83818d8b6))
* remove ? from utils ([fd5695c](https://github.com/ipfs/aegir/commit/fd5695c9534358c14e9ed522512ab9d9d364c76d))
* remove another ? ([62cb87d](https://github.com/ipfs/aegir/commit/62cb87d051c358754a98b5cd44f7d6ec649f4947))
* remove c8 tmp from nyc_output ([e8b4e9f](https://github.com/ipfs/aegir/commit/e8b4e9ff6d85b0ec4efa47729141138bbea75d8b))
* remove userConfig usage ([ee4bca3](https://github.com/ipfs/aegir/commit/ee4bca3038cfbd837093970b899a9078466cfb4d))
* scripts ([9000aba](https://github.com/ipfs/aegir/commit/9000abae849ff5a51ce7addf0e0b483dd4923a10))
* types ([c842d82](https://github.com/ipfs/aegir/commit/c842d821dd6ad84f166a92331164d8403a8a3688))
* types ([c91c715](https://github.com/ipfs/aegir/commit/c91c715f7586e9f2555d3e1457b36480f2548d02))
* types and release cmd ([853ea86](https://github.com/ipfs/aegir/commit/853ea8691d46bb355293f7a7671c749e4f85a282))
* umd and global ([add8ef4](https://github.com/ipfs/aegir/commit/add8ef4abe980f7f0d39ed1e9c67a463bf5bcd44))
* umd bundle ([8f7f4ae](https://github.com/ipfs/aegir/commit/8f7f4ae2a74031ff990970ebc3e66434acdee29d))
* update action ([453c80f](https://github.com/ipfs/aegir/commit/453c80f0d455b8c1a2603a227309c24e5fb14459))
* update action ([3467aed](https://github.com/ipfs/aegir/commit/3467aed0f38b1b800b54b95f6ea82c2a39f08830))
* update deps ([5260ccb](https://github.com/ipfs/aegir/commit/5260ccb236cdfee0e79238dd13b3a8535859d955))
* upgrade karma ([#733](https://github.com/ipfs/aegir/issues/733)) ([1212314](https://github.com/ipfs/aegir/commit/12123143b5d75934d54cbf3736db25f97767acf7))


### Features

* copy .d.ts. to dist ([#738](https://github.com/ipfs/aegir/issues/738)) ([4002b50](https://github.com/ipfs/aegir/commit/4002b5072c6f9e5dfe67e0e5e4f22930bc81d4a6))
* hooks ([3e09f88](https://github.com/ipfs/aegir/commit/3e09f88157e8eb5e4086904f726d1cc16e46d9f3))
* rename --ts flag to --ts-repo and fix ts repo support ([#730](https://github.com/ipfs/aegir/issues/730)) ([3d54004](https://github.com/ipfs/aegir/commit/3d5400406db2c912292ddc10b98586b04a41bf5b))
* ts, build, docs and lint improvements ([#732](https://github.com/ipfs/aegir/issues/732)) ([846bb25](https://github.com/ipfs/aegir/commit/846bb25818f753bea6572194362d7bbdd90d8433))
* update typedoc and improvemnts to docs cmd ([#727](https://github.com/ipfs/aegir/issues/727)) ([1149281](https://github.com/ipfs/aegir/commit/11492815864cf352ed0bba22eaec5996361439c1))
* upgrade linter to v2.0.0 ([9f67cb9](https://github.com/ipfs/aegir/commit/9f67cb99531eda4bc0aa4f0fee0b45ebd15264c1))
* use esbuild and playwright-test ([9a03b99](https://github.com/ipfs/aegir/commit/9a03b991178f4281f26ac7b5d7953e3c3aa40e9c))


### BREAKING CHANGES

* Major linter upgrade may cause errors.
* Config property `bundlesize.maxSize` is deprecated, use `build.bundlesizeMax`

* fix: improve docs cmd

- add more types
- clean code and improve Listr setup

* feat: big utils clean up

- remove unnecessary methods
- add some types
- improve `paths` export, with full paths to dist, test, src and package.json folder/file

* feat: clean lint cmd

- remove old npm deps semver version checks
- update to the new eslint api
- use a new output formatter that actually gives us links we can click and go to the errors
* old npm deps semver was removed

* fix: add types for cmd options
* `--ts` flag renamed to `--ts-repo`
* aegir ts -p docs removed use aegir docs directly



# [30.3.0](https://github.com/ipfs/aegir/compare/v30.2.0...v30.3.0) (2021-01-05)


### Features

* support vendored types and improvements to build and ts cmds ([#705](https://github.com/ipfs/aegir/issues/705)) ([659598b](https://github.com/ipfs/aegir/commit/659598beb5687e80f2aa766c610de66c8592cee7))



# [30.2.0](https://github.com/ipfs/aegir/compare/v30.1.0...v30.2.0) (2020-12-20)


### Bug Fixes

* prepare scripts when aegir gets hoisted ([#702](https://github.com/ipfs/aegir/issues/702)) ([843baef](https://github.com/ipfs/aegir/commit/843baef566d5785e1958061508974dff102d187b))



# [30.1.0](https://github.com/ipfs/aegir/compare/v30.0.0...v30.1.0) (2020-12-18)


### Features

* add utils types ([#701](https://github.com/ipfs/aegir/issues/701)) ([9d8a508](https://github.com/ipfs/aegir/commit/9d8a5080a4634efc507c584042515a895613455b))



# [30.0.0](https://github.com/ipfs/aegir/compare/v29.2.2...v30.0.0) (2020-12-17)


### Bug Fixes

* build types after bundle size ([#695](https://github.com/ipfs/aegir/issues/695)) ([077bbe6](https://github.com/ipfs/aegir/commit/077bbe6c45b5a1d40e519d0ffd3442f88656fe64))
* update deps ([#696](https://github.com/ipfs/aegir/issues/696)) ([f421dd0](https://github.com/ipfs/aegir/commit/f421dd06a5a4f0475a3a06b8ed6b8a01af0b3ef6))


### Features

* update package.json linter config ([#694](https://github.com/ipfs/aegir/issues/694)) ([605cd2a](https://github.com/ipfs/aegir/commit/605cd2a893e615e84d241d47c79f592d126f35db))
* update ts config and new linter ([#697](https://github.com/ipfs/aegir/issues/697)) ([e11b8fe](https://github.com/ipfs/aegir/commit/e11b8fe72db74ad376524fe004b6527293822290))
* upgrade ts to 4.1.x ([#689](https://github.com/ipfs/aegir/issues/689)) ([5f55cba](https://github.com/ipfs/aegir/commit/5f55cbaebc7fab33d4f1f6561714a122ca7ff661))


### BREAKING CHANGES

* at least js-ipfs monorepo fails with ts 4.1
* tsconfig changed and linter has new rules for ts files.



## [29.2.2](https://github.com/ipfs/aegir/compare/v29.2.1...v29.2.2) (2020-12-03)



## [29.2.1](https://github.com/ipfs/aegir/compare/v29.2.0...v29.2.1) (2020-12-02)


### Bug Fixes

* fix electron timeout and renderer console.assert ([#685](https://github.com/ipfs/aegir/issues/685)) ([b14a9da](https://github.com/ipfs/aegir/commit/b14a9daa2f68bffc4ff7cb2aee74047fee51b7df))



# [29.2.0](https://github.com/ipfs/aegir/compare/v29.1.0...v29.2.0) (2020-11-30)


### Bug Fixes

* pin ts to 4.0.x ([#683](https://github.com/ipfs/aegir/issues/683)) ([70b85fc](https://github.com/ipfs/aegir/commit/70b85fc5bfb43f7e38ea09ae26e367afe8145ed2))



# [29.1.0](https://github.com/ipfs/aegir/compare/v29.0.1...v29.1.0) (2020-11-26)


### Bug Fixes

* update ts lib config ([#680](https://github.com/ipfs/aegir/issues/680)) ([aeca210](https://github.com/ipfs/aegir/commit/aeca21005a391a7fe9d09ed73305471c8a8e36ac))



## [29.0.1](https://github.com/ipfs/aegir/compare/v29.0.0...v29.0.1) (2020-11-20)


### Bug Fixes

* remove tsbuildinfo files when building types ([acea763](https://github.com/ipfs/aegir/commit/acea7639d0314c4025d811f7f56cd5316b05eebc))



# [29.0.0](https://github.com/ipfs/aegir/compare/v28.2.0...v29.0.0) (2020-11-20)


### Bug Fixes

* clean deps and more ([#677](https://github.com/ipfs/aegir/issues/677)) ([ac2a3f7](https://github.com/ipfs/aegir/commit/ac2a3f76f3da82c98b69a71a3f823f1d663bc2b4))
* fix bundle size action in direct pushes and fork PRs ([#679](https://github.com/ipfs/aegir/issues/679)) ([e3d3d34](https://github.com/ipfs/aegir/commit/e3d3d34b7e4b638e8a9a89158001e54c6b9e4759))
* more ts docs and include private and protected in docs ([#678](https://github.com/ipfs/aegir/issues/678)) ([a4793cf](https://github.com/ipfs/aegir/commit/a4793cfd2ef1aac4f3f28b448e9e7f19e4ae9117))


### Features

* add ts cmd ([#671](https://github.com/ipfs/aegir/issues/671)) ([f332803](https://github.com/ipfs/aegir/commit/f332803b5203e3c3cddc4494ee90c0d9f595c43c))


### BREAKING CHANGES

* Update all the deps except webpack. 



# [28.2.0](https://github.com/ipfs/aegir/compare/v28.1.0...v28.2.0) (2020-11-16)


### Features

* add -p flag to dependency-check to only check prod deps ([#672](https://github.com/ipfs/aegir/issues/672)) ([44d12ab](https://github.com/ipfs/aegir/commit/44d12ab45eb5204d1997c1d33317ad564fc701cc))



# [28.1.0](https://github.com/ipfs/aegir/compare/v28.0.2...v28.1.0) (2020-10-26)


### Bug Fixes

* allow bundle to be used in web workers ([#408](https://github.com/ipfs/aegir/issues/408)) ([3f72e50](https://github.com/ipfs/aegir/commit/3f72e5074145a8f2ec03143db4230514af664f95))



## [28.0.2](https://github.com/ipfs/aegir/compare/v28.0.1...v28.0.2) (2020-10-20)


### Bug Fixes

* downgrade electron and electron-mocha ([#655](https://github.com/ipfs/aegir/issues/655)) ([caf4c8f](https://github.com/ipfs/aegir/commit/caf4c8f6555190c74704a5396d11525336a2d8d2))



## [28.0.1](https://github.com/ipfs/aegir/compare/v28.0.0...v28.0.1) (2020-10-20)


### Bug Fixes

* remove which, revert to available mocha ([5b77754](https://github.com/ipfs/aegir/commit/5b77754baaa82a197ad5e741c6be8413fdb76f63))



# [28.0.0](https://github.com/ipfs/aegir/compare/v27.0.0...v28.0.0) (2020-10-20)


### Bug Fixes

* remove --noUnhandledPromiseRejections option ([#653](https://github.com/ipfs/aegir/issues/653)) ([e478259](https://github.com/ipfs/aegir/commit/e47825947a19df31207c1819d36609207ec9d805))


### Features

* allow overriding runtime path for bundle size check ([#652](https://github.com/ipfs/aegir/issues/652)) ([f2ad1b9](https://github.com/ipfs/aegir/commit/f2ad1b9da5597ac54fc1d161c5b4a06195109b43))



<a name="27.0.0"></a>
# [27.0.0](https://github.com/ipfs/aegir/compare/v26.0.0...v27.0.0) (2020-10-06)


### Features

* factor eslint config to eslint-config-ipfs ([#638](https://github.com/ipfs/aegir/issues/638)) ([0fb42b9](https://github.com/ipfs/aegir/commit/0fb42b9))



<a name="26.0.0"></a>
# [26.0.0](https://github.com/ipfs/aegir/compare/v25.1.0...v26.0.0) (2020-08-14)


### Features

* Use file type based lint rules ([#621](https://github.com/ipfs/aegir/issues/621)) ([fdc002e](https://github.com/ipfs/aegir/commit/fdc002e))


### BREAKING CHANGES

* new linting file used for .ts files



<a name="25.1.0"></a>
# [25.1.0](https://github.com/ipfs/aegir/compare/v25.0.0...v25.1.0) (2020-08-11)


### Bug Fixes

* update bundlesize help command ([#617](https://github.com/ipfs/aegir/issues/617)) ([beedcdb](https://github.com/ipfs/aegir/commit/beedcdb))


### Features

* add support for the mocha --invert flag ([#622](https://github.com/ipfs/aegir/issues/622)) ([964d05f](https://github.com/ipfs/aegir/commit/964d05f))



<a name="25.0.0"></a>
# [25.0.0](https://github.com/ipfs/aegir/compare/v24.0.0...v25.0.0) (2020-06-20)


### Bug Fixes

* remove docsFormats from release cmd ([39e44b0](https://github.com/ipfs/aegir/commit/39e44b0))
* use bugfixes: true in the babel config ([2fc9878](https://github.com/ipfs/aegir/commit/2fc9878))


### Features

* support ts([#584](https://github.com/ipfs/aegir/issues/584)) ([9dc23a3](https://github.com/ipfs/aegir/commit/9dc23a3))



<a name="24.0.0"></a>
# [24.0.0](https://github.com/ipfs/aegir/compare/v23.0.0...v24.0.0) (2020-06-16)


### Features

* default to not include node globals anf builtins ([#578](https://github.com/ipfs/aegir/issues/578)) ([fecb4ae](https://github.com/ipfs/aegir/commit/fecb4ae))


### BREAKING CHANGES

* browser code will NOT have node globals and builtins available.



<a name="23.0.0"></a>
# [23.0.0](https://github.com/ipfs/aegir/compare/v22.1.0...v23.0.0) (2020-06-12)


### Bug Fixes

* remove support for flow ([#579](https://github.com/ipfs/aegir/issues/579)) ([870c64d](https://github.com/ipfs/aegir/commit/870c64d))


### Features

* clean up deps, utils, release cmd and docs ([#581](https://github.com/ipfs/aegir/issues/581)) ([4b4ce35](https://github.com/ipfs/aegir/commit/4b4ce35))


### BREAKING CHANGES

* remove karma-edge and remove `docsFormats` from `docs` cmd
* Flow support was removed



<a name="22.1.0"></a>
# [22.1.0](https://github.com/ipfs/aegir/compare/v22.0.0...v22.1.0) (2020-06-10)


### Features

* checks action and bundlesize check improvements ([#532](https://github.com/ipfs/aegir/issues/532)) ([435bb20](https://github.com/ipfs/aegir/commit/435bb20))



<a name="22.0.0"></a>
# [22.0.0](https://github.com/ipfs/aegir/compare/v21.10.2...v22.0.0) (2020-05-07)


### Features

* turn off sourcemaps for production builds ([#549](https://github.com/ipfs/aegir/issues/549)) ([19bb300](https://github.com/ipfs/aegir/commit/19bb300))


### BREAKING CHANGES

* no more sourcemaps and unminified bundle for productions builds



<a name="21.10.2"></a>
## [21.10.2](https://github.com/ipfs/aegir/compare/v21.10.1...v21.10.2) (2020-05-06)


### Bug Fixes

* fix process.env in karma tests ([#559](https://github.com/ipfs/aegir/issues/559)) ([09ba9c6](https://github.com/ipfs/aegir/commit/09ba9c6))



<a name="21.10.1"></a>
## [21.10.1](https://github.com/ipfs/aegir/compare/v21.10.0...v21.10.1) (2020-05-05)


### Bug Fixes

* whitelist process env keys ([#557](https://github.com/ipfs/aegir/issues/557)) ([e36e1de](https://github.com/ipfs/aegir/commit/e36e1de))



<a name="21.10.0"></a>
# [21.10.0](https://github.com/ipfs/aegir/compare/v21.9.2...v21.10.0) (2020-05-05)


### Features

* echo request headers ([#553](https://github.com/ipfs/aegir/issues/553)) ([8444136](https://github.com/ipfs/aegir/commit/8444136))



<a name="21.9.2"></a>
## [21.9.2](https://github.com/ipfs/aegir/compare/v21.9.1...v21.9.2) (2020-04-30)


### Bug Fixes

* bump deps ([5dd58e6](https://github.com/ipfs/aegir/commit/5dd58e6))



<a name="21.9.1"></a>
## [21.9.1](https://github.com/ipfs/aegir/compare/v21.9.0...v21.9.1) (2020-04-30)


### Bug Fixes

* better stack traces and add process to node: false ([1f2dab6](https://github.com/ipfs/aegir/commit/1f2dab6))



<a name="21.9.0"></a>
# [21.9.0](https://github.com/ipfs/aegir/compare/v21.8.1...v21.9.0) (2020-04-20)


### Bug Fixes

* add test to dependency check ([bf81ee2](https://github.com/ipfs/aegir/commit/bf81ee2))
* bump electron to 8.2.2 ([cacb7af](https://github.com/ipfs/aegir/commit/cacb7af))
* remove karma junit ([9a2ad2c](https://github.com/ipfs/aegir/commit/9a2ad2c))
* remove unused util ([cefd014](https://github.com/ipfs/aegir/commit/cefd014))


### Features

* bump extract-zip to 2.0.0 ([b1f80fd](https://github.com/ipfs/aegir/commit/b1f80fd))
* bump karma to 5.0.1 ([e229a66](https://github.com/ipfs/aegir/commit/e229a66))
* improve errors and dep check cmd ([64f16db](https://github.com/ipfs/aegir/commit/64f16db)), closes [#428](https://github.com/ipfs/aegir/issues/428)



<a name="21.8.1"></a>
## [21.8.1](https://github.com/ipfs/aegir/compare/v21.8.0...v21.8.1) (2020-04-14)


### Bug Fixes

* fix undefined hook return ([1e90b5c](https://github.com/ipfs/aegir/commit/1e90b5c))



<a name="21.8.0"></a>
# [21.8.0](https://github.com/ipfs/aegir/compare/v21.7.0...v21.8.0) (2020-04-14)


### Features

* forward env to webpack ([ee90e20](https://github.com/ipfs/aegir/commit/ee90e20))



<a name="21.7.0"></a>
# [21.7.0](https://github.com/ipfs/aegir/compare/v21.6.0...v21.7.0) (2020-04-13)


### Features

* add download endpoint to echo server ([4fc3220](https://github.com/ipfs/aegir/commit/4fc3220))



<a name="21.6.0"></a>
# [21.6.0](https://github.com/ipfs/aegir/compare/v21.5.1...v21.6.0) (2020-04-13)


### Features

* export assert and chai itself ([dbe8145](https://github.com/ipfs/aegir/commit/dbe8145))



<a name="21.5.1"></a>
## [21.5.1](https://github.com/ipfs/aegir/compare/v21.5.0...v21.5.1) (2020-04-13)



<a name="21.5.0"></a>
# [21.5.0](https://github.com/ipfs/aegir/compare/v21.4.5...v21.5.0) (2020-04-13)


### Bug Fixes

* disable gpg sign in tests ([8714603](https://github.com/ipfs/aegir/commit/8714603))
* fix path in the fixture test ([30e9331](https://github.com/ipfs/aegir/commit/30e9331))


### Features

* add testing helpers ([a9d0561](https://github.com/ipfs/aegir/commit/a9d0561))



<a name="21.4.5"></a>
## [21.4.5](https://github.com/ipfs/aegir/compare/v21.4.4...v21.4.5) (2020-03-25)


### Bug Fixes

* add buffer to fixtures ([775e986](https://github.com/ipfs/aegir/commit/775e986))



<a name="21.4.4"></a>
## [21.4.4](https://github.com/ipfs/aegir/compare/v21.4.3...v21.4.4) (2020-03-23)


### Bug Fixes

* fix release node flag and remove progress ([ac2baa7](https://github.com/ipfs/aegir/commit/ac2baa7))



<a name="21.4.3"></a>
## [21.4.3](https://github.com/ipfs/aegir/compare/v21.4.2...v21.4.3) (2020-03-20)


### Bug Fixes

* fix node flag ([17ec20b](https://github.com/ipfs/aegir/commit/17ec20b))



<a name="21.4.2"></a>
## [21.4.2](https://github.com/ipfs/aegir/compare/v21.4.1...v21.4.2) (2020-03-20)


### Bug Fixes

* fix browser tests node flag ([fbbd77a](https://github.com/ipfs/aegir/commit/fbbd77a))



<a name="21.4.1"></a>
## [21.4.1](https://github.com/ipfs/aegir/compare/v21.4.0...v21.4.1) (2020-03-20)


### Bug Fixes

* fix fixtures loading ([ec16728](https://github.com/ipfs/aegir/commit/ec16728)), closes [#533](https://github.com/ipfs/aegir/issues/533)
* improve --node false ([d3a104f](https://github.com/ipfs/aegir/commit/d3a104f))



<a name="21.4.0"></a>
# [21.4.0](https://github.com/ipfs/aegir/compare/v21.3.3...v21.4.0) (2020-03-18)


### Features

* add node options to test and build ([a756945](https://github.com/ipfs/aegir/commit/a756945))



<a name="21.3.3"></a>
## [21.3.3](https://github.com/ipfs/aegir/compare/v21.3.2...v21.3.3) (2020-03-18)


### Bug Fixes

* fix karma fixture loading ([d2fa1ce](https://github.com/ipfs/aegir/commit/d2fa1ce))



<a name="21.3.2"></a>
## [21.3.2](https://github.com/ipfs/aegir/compare/v21.3.1...v21.3.2) (2020-03-16)


### Bug Fixes

* use execa for dirty check ([682cd11](https://github.com/ipfs/aegir/commit/682cd11))



<a name="21.3.1"></a>
## [21.3.1](https://github.com/ipfs/aegir/compare/v21.3.0...v21.3.1) (2020-03-16)


### Bug Fixes

* fix webpack warn, make electron lazy ([#521](https://github.com/ipfs/aegir/issues/521)) ([68fc177](https://github.com/ipfs/aegir/commit/68fc177))
* pass --full-trace option to electron-mocha ([#519](https://github.com/ipfs/aegir/issues/519)) ([a100c87](https://github.com/ipfs/aegir/commit/a100c87)), closes [/github.com/jprichardson/electron-mocha/blob/master/lib/run.js#L166](https://github.com//github.com/jprichardson/electron-mocha/blob/master/lib/run.js/issues/L166)
* run tests with progress ([e27eded](https://github.com/ipfs/aegir/commit/e27eded))



<a name="21.3.0"></a>
# [21.3.0](https://github.com/ipfs/aegir/compare/v21.2.0...v21.3.0) (2020-02-20)


### Bug Fixes

* update deps ([ad0bcc3](https://github.com/ipfs/aegir/commit/ad0bcc3))



<a name="21.2.0"></a>
# [21.2.0](https://github.com/ipfs/aegir/compare/v21.1.0...v21.2.0) (2020-02-20)


### Features

* allow enabling/disabling each part of the release process ([#526](https://github.com/ipfs/aegir/issues/526)) ([9c44626](https://github.com/ipfs/aegir/commit/9c44626))



<a name="21.1.0"></a>
# [21.1.0](https://github.com/ipfs/aegir/compare/v21.0.2...v21.1.0) (2020-02-19)


### Features

* test dependants ([#525](https://github.com/ipfs/aegir/issues/525)) ([4f42860](https://github.com/ipfs/aegir/commit/4f42860))



<a name="21.0.2"></a>
## [21.0.2](https://github.com/ipfs/aegir/compare/v21.0.1...v21.0.2) (2020-02-14)


### Bug Fixes

* fix electron detection ([#520](https://github.com/ipfs/aegir/issues/520)) ([0b911ec](https://github.com/ipfs/aegir/commit/0b911ec))



<a name="21.0.1"></a>
## [21.0.1](https://github.com/ipfs/aegir/compare/v21.0.0...v21.0.1) (2020-02-14)


### Bug Fixes

* better default for userconfig ([4a7f21d](https://github.com/ipfs/aegir/commit/4a7f21d))



<a name="21.0.0"></a>
# [21.0.0](https://github.com/ipfs/aegir/compare/v20.6.1...v21.0.0) (2020-02-14)


### Bug Fixes

* cleanup, update deps, remove deps ([#512](https://github.com/ipfs/aegir/issues/512)) ([6d4d25a](https://github.com/ipfs/aegir/commit/6d4d25a))


### BREAKING CHANGES

* hooks no longer support callbacks, eslint packages were updated so errors maybe appear and contributors list feature will change a bit.



<a name="20.6.1"></a>
## [20.6.1](https://github.com/ipfs/aegir/compare/v20.6.0...v20.6.1) (2020-02-14)


### Bug Fixes

* remove package-lock before generating npm-shrinkwrap file ([#518](https://github.com/ipfs/aegir/issues/518)) ([02fc308](https://github.com/ipfs/aegir/commit/02fc308)), closes [#516](https://github.com/ipfs/aegir/issues/516)



<a name="20.6.0"></a>
# [20.6.0](https://github.com/ipfs/aegir/compare/v20.5.1...v20.6.0) (2020-02-04)


### Features

* make unhandled promise rejections fail tests ([#507](https://github.com/ipfs/aegir/issues/507)) ([b634474](https://github.com/ipfs/aegir/commit/b634474)), closes [#505](https://github.com/ipfs/aegir/issues/505)



<a name="20.5.1"></a>
## [20.5.1](https://github.com/ipfs/aegir/compare/v20.5.0...v20.5.1) (2020-01-16)


### Bug Fixes

* fix typo in aegir test --help examples ([082cc58](https://github.com/ipfs/aegir/commit/082cc58))



<a name="20.5.0"></a>
# [20.5.0](https://github.com/ipfs/aegir/compare/v20.4.1...v20.5.0) (2019-12-11)


### Bug Fixes

* specify remote for branch to checkout ([#465](https://github.com/ipfs/aegir/issues/465)) ([cb94e01](https://github.com/ipfs/aegir/commit/cb94e01))


### Features

* support lockfiles during text-external ([#450](https://github.com/ipfs/aegir/issues/450)) ([7ee3d14](https://github.com/ipfs/aegir/commit/7ee3d14))
* update deps should be non breaking ([c74a430](https://github.com/ipfs/aegir/commit/c74a430))



<a name="20.4.1"></a>
## [20.4.1](https://github.com/ipfs/aegir/compare/v20.4.0...v20.4.1) (2019-10-11)


### Bug Fixes

* force --verbose for verbose mode ([#447](https://github.com/ipfs/aegir/issues/447)) ([5ed2fbe](https://github.com/ipfs/aegir/commit/5ed2fbe))



<a name="20.4.0"></a>
# [20.4.0](https://github.com/ipfs/aegir/compare/v20.3.2...v20.4.0) (2019-10-10)


### Features

* allow testing branches of third party repos ([#438](https://github.com/ipfs/aegir/issues/438)) ([39ed250](https://github.com/ipfs/aegir/commit/39ed250))



<a name="20.3.2"></a>
## [20.3.2](https://github.com/ipfs/aegir/compare/v20.3.1...v20.3.2) (2019-10-10)


### Bug Fixes

* remove electron from the defaults target ([9ff4633](https://github.com/ipfs/aegir/commit/9ff4633))
* remove manual push after rc publish ([#432](https://github.com/ipfs/aegir/issues/432)) ([dfc5bb5](https://github.com/ipfs/aegir/commit/dfc5bb5)), closes [#426](https://github.com/ipfs/aegir/issues/426)


### Features

* prefix rc with release ([#431](https://github.com/ipfs/aegir/issues/431)) ([8b1cf8a](https://github.com/ipfs/aegir/commit/8b1cf8a))



<a name="20.3.1"></a>
## [20.3.1](https://github.com/ipfs/aegir/compare/v20.3.0...v20.3.1) (2019-09-19)


### Bug Fixes

* fix karma timeout ([a413878](https://github.com/ipfs/aegir/commit/a413878))



<a name="20.3.0"></a>
# [20.3.0](https://github.com/ipfs/aegir/compare/v20.2.0...v20.3.0) (2019-09-19)


### Bug Fixes

* push to the current branch ([#426](https://github.com/ipfs/aegir/issues/426)) ([d82815a](https://github.com/ipfs/aegir/commit/d82815a))


### Features

* add AEGIR_RUNNER env var and support timeout in the browser and electron test runners. ([61cc413](https://github.com/ipfs/aegir/commit/61cc413))
* add test-external command ([#425](https://github.com/ipfs/aegir/issues/425)) ([92236ba](https://github.com/ipfs/aegir/commit/92236ba))



<a name="20.2.0"></a>
# [20.2.0](https://github.com/ipfs/aegir/compare/v20.1.0...v20.2.0) (2019-09-16)


### Bug Fixes

* fix linter ([903bd03](https://github.com/ipfs/aegir/commit/903bd03))


### Features

* adds command to update release candidates ([#421](https://github.com/ipfs/aegir/issues/421)) ([36de3ff](https://github.com/ipfs/aegir/commit/36de3ff))
* update deps ([#423](https://github.com/ipfs/aegir/issues/423)) ([24ba24b](https://github.com/ipfs/aegir/commit/24ba24b))


### BREAKING CHANGES

* linter upgrade you may need to fix linting problems



<a name="20.1.0"></a>
# [20.1.0](https://github.com/ipfs/aegir/compare/v20.0.0...v20.1.0) (2019-09-10)


### Features

* add commands for publishing rc ([#419](https://github.com/ipfs/aegir/issues/419)) ([d1cc8d5](https://github.com/ipfs/aegir/commit/d1cc8d5))



<a name="20.0.0"></a>
# [20.0.0](https://github.com/ipfs/aegir/compare/v19.0.5...v20.0.0) (2019-07-12)


### Bug Fixes

* use the default docs theme ([#396](https://github.com/ipfs/aegir/issues/396)) ([ca63d17](https://github.com/ipfs/aegir/commit/ca63d17)), closes [#369](https://github.com/ipfs/aegir/issues/369)


### Features

* aegir test --100 for full coverage validation ([#360](https://github.com/ipfs/aegir/issues/360)) ([690c459](https://github.com/ipfs/aegir/commit/690c459))
* update deps and make lint --fix work ([#395](https://github.com/ipfs/aegir/issues/395)) ([7db9e4c](https://github.com/ipfs/aegir/commit/7db9e4c)), closes [#311](https://github.com/ipfs/aegir/issues/311)


### BREAKING CHANGES

* The eslint rules changes, you will need to `run npx aegir lint --fix`



<a name="19.0.5"></a>
## [19.0.5](https://github.com/ipfs/aegir/compare/v19.0.4...v19.0.5) (2019-07-05)


### Features

* support async hooks ([#390](https://github.com/ipfs/aegir/issues/390)) ([717f888](https://github.com/ipfs/aegir/commit/717f888)), closes [ipfs/js-ipfsd-ctl#353](https://github.com/ipfs/js-ipfsd-ctl/issues/353) [ipfs/js-ipfs#1670](https://github.com/ipfs/js-ipfs/issues/1670)



<a name="19.0.4"></a>
## [19.0.4](https://github.com/ipfs/aegir/compare/v19.0.3...v19.0.4) (2019-06-29)


### Bug Fixes

* update docs for electron ci config ([ff6e16b](https://github.com/ipfs/aegir/commit/ff6e16b))
* use default babel config and update browserslist ([#382](https://github.com/ipfs/aegir/issues/382)) ([4ad7f19](https://github.com/ipfs/aegir/commit/4ad7f19)), closes [#379](https://github.com/ipfs/aegir/issues/379) [#380](https://github.com/ipfs/aegir/issues/380) [#381](https://github.com/ipfs/aegir/issues/381)



<a name="19.0.3"></a>
## [19.0.3](https://github.com/ipfs/aegir/compare/v19.0.2...v19.0.3) (2019-05-24)


### Bug Fixes

* fix gh release ([8eba533](https://github.com/ipfs/aegir/commit/8eba533))



<a name="19.0.2"></a>
## [19.0.2](https://github.com/ipfs/aegir/compare/v19.0.1...v19.0.2) (2019-05-24)



<a name="19.0.1"></a>
## [19.0.1](https://github.com/ipfs/aegir/compare/v19.0.0...v19.0.1) (2019-05-24)



<a name="19.0.0"></a>
# [19.0.0](https://github.com/ipfs/aegir/compare/v18.2.2...v19.0.0) (2019-05-24)


### Bug Fixes

* allow development versions to use caret ([#356](https://github.com/ipfs/aegir/issues/356)) ([4a50e11](https://github.com/ipfs/aegir/commit/4a50e11)), closes [#346](https://github.com/ipfs/aegir/issues/346)
* fix breaking change from read-pkg-up ([1b3205c](https://github.com/ipfs/aegir/commit/1b3205c))
* fix corejs babel config ([2660dc3](https://github.com/ipfs/aegir/commit/2660dc3))
* make AEGir Node.js 12 compatible ([#357](https://github.com/ipfs/aegir/issues/357)) ([924eed2](https://github.com/ipfs/aegir/commit/924eed2))
* update dependencies ([e280ead](https://github.com/ipfs/aegir/commit/e280ead))
* update electron test config ([b15aca8](https://github.com/ipfs/aegir/commit/b15aca8))


### Features

* add support for electron in tests ([#359](https://github.com/ipfs/aegir/issues/359)) ([4363230](https://github.com/ipfs/aegir/commit/4363230))
* add support for electron renderer in test and docs ([b170814](https://github.com/ipfs/aegir/commit/b170814))
* change linting rules to make `console.foo` an error ([#299](https://github.com/ipfs/aegir/issues/299)) ([30191ac](https://github.com/ipfs/aegir/commit/30191ac))
* require await in functions marked async ([#355](https://github.com/ipfs/aegir/issues/355)) ([b26ac5c](https://github.com/ipfs/aegir/commit/b26ac5c)), closes [#354](https://github.com/ipfs/aegir/issues/354)
* update deps and cleanup ([#358](https://github.com/ipfs/aegir/issues/358)) ([1cb8cf2](https://github.com/ipfs/aegir/commit/1cb8cf2)), closes [#350](https://github.com/ipfs/aegir/issues/350) [#193](https://github.com/ipfs/aegir/issues/193)


### BREAKING CHANGES

* lots of deps updated hidden problems might still exist
* console.* statement are NOW a lint error  



<a name="18.2.2"></a>
## [18.2.2](https://github.com/ipfs/aegir/compare/v18.2.1...v18.2.2) (2019-04-12)



<a name="18.2.1"></a>
## [18.2.1](https://github.com/ipfs/aegir/compare/v18.2.0...v18.2.1) (2019-03-04)


### Bug Fixes

* use the same timeout for mocha and karma-mocha ([#338](https://github.com/ipfs/aegir/issues/338)) ([58fb8b0](https://github.com/ipfs/aegir/commit/58fb8b0))



<a name="18.2.0"></a>
# [18.2.0](https://github.com/ipfs/aegir/compare/v18.1.1...v18.2.0) (2019-02-21)


### Features

* add bundlesize support to the build cmd ([#335](https://github.com/ipfs/aegir/issues/335)) ([55b92a6](https://github.com/ipfs/aegir/commit/55b92a6))
* adds no-sandbox to ChromeHeadless in karma config ([#333](https://github.com/ipfs/aegir/issues/333)) ([a6f4cc2](https://github.com/ipfs/aegir/commit/a6f4cc2))



<a name="18.1.1"></a>
## [18.1.1](https://github.com/ipfs/aegir/compare/v18.1.0...v18.1.1) (2019-02-19)


### Bug Fixes

* exclude fixtures from dep-check ([#334](https://github.com/ipfs/aegir/issues/334)) ([0b00c1f](https://github.com/ipfs/aegir/commit/0b00c1f))



<a name="18.1.0"></a>
# [18.1.0](https://github.com/ipfs/aegir/compare/v18.0.3...v18.1.0) (2019-02-12)


### Bug Fixes

* fix the debug alias ([5a47b7e](https://github.com/ipfs/aegir/commit/5a47b7e))



<a name="18.0.3"></a>
## [18.0.3](https://github.com/ipfs/aegir/compare/v18.0.2...v18.0.3) (2019-01-08)


### Bug Fixes

* pull in karma-entry.js from current directory ([#313](https://github.com/ipfs/aegir/issues/313)) ([3597ce5](https://github.com/ipfs/aegir/commit/3597ce5))



<a name="18.0.2"></a>
## [18.0.2](https://github.com/ipfs/aegir/compare/v18.0.1...v18.0.2) (2018-12-20)



<a name="18.0.1"></a>
## [18.0.1](https://github.com/ipfs/aegir/compare/v18.0.0...v18.0.1) (2018-12-20)


### Bug Fixes

* add node 8 support ([7ec4cf5](https://github.com/ipfs/aegir/commit/7ec4cf5))



<a name="18.0.0"></a>
# [18.0.0](https://github.com/ipfs/aegir/compare/v17.1.1...v18.0.0) (2018-12-19)


### Bug Fixes

* make babel and webpack safer and faster ([#305](https://github.com/ipfs/aegir/issues/305)) ([e47ea98](https://github.com/ipfs/aegir/commit/e47ea98))


### Features

* add package.json linter ([#304](https://github.com/ipfs/aegir/issues/304)) ([f90bd78](https://github.com/ipfs/aegir/commit/f90bd78))



<a name="17.1.1"></a>
## [17.1.1](https://github.com/ipfs/aegir/compare/v17.1.0...v17.1.1) (2018-11-23)


### Bug Fixes

* upgrade eslint to v5 ([#298](https://github.com/ipfs/aegir/issues/298)) ([8a3e9cd](https://github.com/ipfs/aegir/commit/8a3e9cd)), closes [eslint/eslint#10587](https://github.com/eslint/eslint/issues/10587)


### Features

* add rule to catch `.only` in tests ([#300](https://github.com/ipfs/aegir/issues/300)) ([1465a09](https://github.com/ipfs/aegir/commit/1465a09))



<a name="17.1.0"></a>
# [17.1.0](https://github.com/ipfs/aegir/compare/v17.0.1...v17.1.0) (2018-11-20)


### Features

* prereleases ([#289](https://github.com/ipfs/aegir/issues/289)) ([f13d700](https://github.com/ipfs/aegir/commit/f13d700)), closes [/github.com/npm/node-semver/blob/6086e5ae8e8e253b915b3885a809cfa7532d28f7/semver.js#L365-L395](https://github.com//github.com/npm/node-semver/blob/6086e5ae8e8e253b915b3885a809cfa7532d28f7/semver.js/issues/L365-L395)



<a name="17.0.1"></a>
## [17.0.1](https://github.com/ipfs/aegir/compare/v17.0.0...v17.0.1) (2018-10-30)


### Bug Fixes

* fix documentation.js not loading files and change input file ([#272](https://github.com/ipfs/aegir/issues/272)) ([2830618](https://github.com/ipfs/aegir/commit/2830618))
* remove CONFIG_FILE const ([c563c87](https://github.com/ipfs/aegir/commit/c563c87))


### Features

* add support for eslint overrides ([643f08c](https://github.com/ipfs/aegir/commit/643f08c))



<a name="17.0.0"></a>
# [17.0.0](https://github.com/ipfs/aegir/compare/v16.0.0...v17.0.0) (2018-10-26)



<a name="16.0.0"></a>
# [16.0.0](https://github.com/ipfs/aegir/compare/v15.3.1...v16.0.0) (2018-10-26)


### Bug Fixes

* dont require missing config ([6a5094c](https://github.com/ipfs/aegir/commit/6a5094c))
* remove requirement to include [@returns](https://github.com/returns) in jsdoc ([d713393](https://github.com/ipfs/aegir/commit/d713393))
* update stream http ([410b3ce](https://github.com/ipfs/aegir/commit/410b3ce))


### Features

* add analyze options and upgrade deps ([#274](https://github.com/ipfs/aegir/issues/274)) ([aa9a737](https://github.com/ipfs/aegir/commit/aa9a737))



<a name="15.3.1"></a>
## [15.3.1](https://github.com/ipfs/aegir/compare/v15.3.0...v15.3.1) (2018-10-03)


### Bug Fixes

* bump version before building ([44e0b4d](https://github.com/ipfs/aegir/commit/44e0b4d)), closes [#208](https://github.com/ipfs/aegir/issues/208)



<a name="15.3.0"></a>
# [15.3.0](https://github.com/ipfs/aegir/compare/v15.2.0...v15.3.0) (2018-10-03)


### Bug Fixes

* build not run during release cmd ([6c6762f](https://github.com/ipfs/aegir/commit/6c6762f))
* do not smother user config parse error ([9d615a8](https://github.com/ipfs/aegir/commit/9d615a8))
* fix type in the docs template ([42a198d](https://github.com/ipfs/aegir/commit/42a198d))
* generate sourcemap for minified build ([e581c68](https://github.com/ipfs/aegir/commit/e581c68))
* unminified builds should not be minified ([af41034](https://github.com/ipfs/aegir/commit/af41034))
* windows takes 2 minutes to exit ([3166c70](https://github.com/ipfs/aegir/commit/3166c70))


### Features

* set browsers with AEGIR_BROWSERS ([1600344](https://github.com/ipfs/aegir/commit/1600344))



<a name="15.2.0"></a>
# [15.2.0](https://github.com/ipfs/aegir/compare/v15.1.0...v15.2.0) (2018-09-17)


### Features

* support one time passwords ([7a021c4](https://github.com/ipfs/aegir/commit/7a021c4))



<a name="15.1.0"></a>
# [15.1.0](https://github.com/ipfs/aegir/compare/v15.0.1...v15.1.0) (2018-07-26)


### Features

* add grep and colors option to test ([95789e9](https://github.com/ipfs/aegir/commit/95789e9))



<a name="15.0.1"></a>
## [15.0.1](https://github.com/ipfs/aegir/compare/v15.0.0...v15.0.1) (2018-07-20)


### Bug Fixes

* make AEgir upgrade smoother ([36c83d3](https://github.com/ipfs/aegir/commit/36c83d3))



<a name="15.0.0"></a>
# [15.0.0](https://github.com/ipfs/aegir/compare/v14.0.0...v15.0.0) (2018-07-05)


### Bug Fixes

* add unminified build ([659271c](https://github.com/ipfs/aegir/commit/659271c))
* fix node version, add fromAegir to utils ([241f0ca](https://github.com/ipfs/aegir/commit/241f0ca))
* fix original build and test with webpack 4 ([9a98a98](https://github.com/ipfs/aegir/commit/9a98a98))
* fix the test --flow options description ([e7eb815](https://github.com/ipfs/aegir/commit/e7eb815))
* make pre-push opt-in ([870bd2d](https://github.com/ipfs/aegir/commit/870bd2d))
* reduce browserlist to production only ([428c125](https://github.com/ipfs/aegir/commit/428c125))
* rework NODE_ENV, indentation, support fn in user webpack ([4f31cea](https://github.com/ipfs/aegir/commit/4f31cea))
* use babel instead of flow-remove-types ([c969a97](https://github.com/ipfs/aegir/commit/c969a97))
* use transform-flow-comments Babel plugin ([32a0373](https://github.com/ipfs/aegir/commit/32a0373))


### Features

* add ability for user to configure linted files ([4accd80](https://github.com/ipfs/aegir/commit/4accd80))
* add experimental browser build and karma setup ([a8b393c](https://github.com/ipfs/aegir/commit/a8b393c))
* add flow support ([25043f6](https://github.com/ipfs/aegir/commit/25043f6))
* lint commit messages ([0597098](https://github.com/ipfs/aegir/commit/0597098))


### BREAKING CHANGES

* webpack bumped to version 4+



<a name="14.0.0"></a>
# [14.0.0](https://github.com/ipfs/aegir/compare/v13.1.0...v14.0.0) (2018-05-31)


### Bug Fixes

* append random number to coverage reports ([139ad19](https://github.com/ipfs/aegir/commit/139ad19))
* restores previous behaviour for loading browser fixtures ([34cea98](https://github.com/ipfs/aegir/commit/34cea98)), closes [#235](https://github.com/ipfs/aegir/issues/235)


### Features

* allow loading resources from hoisted dependencies ([0d47028](https://github.com/ipfs/aegir/commit/0d47028))
* enforce package.json dependency version guidelines ([47a0080](https://github.com/ipfs/aegir/commit/47a0080))


### Performance Improvements

* **cli:** Inline requires in CLI inclusions ([0a2ec35](https://github.com/ipfs/aegir/commit/0a2ec35))



<a name="13.1.0"></a>
# [13.1.0](https://github.com/ipfs/aegir/compare/v13.0.7...v13.1.0) (2018-04-24)


### Features

* enable uglify mangle and compress ([8d323b7](https://github.com/ipfs/aegir/commit/8d323b7))



<a name="13.0.7"></a>
## [13.0.7](https://github.com/ipfs/aegir/compare/v13.0.6...v13.0.7) (2018-04-16)


### Bug Fixes

* don't show warning if test/browser.js doesn't exist ([4785bce](https://github.com/ipfs/aegir/commit/4785bce)), closes [#204](https://github.com/ipfs/aegir/issues/204)


### Features

* add inline-source-map for webpack ([1ff41e5](https://github.com/ipfs/aegir/commit/1ff41e5))



<a name="13.0.6"></a>
## [13.0.6](https://github.com/ipfs/aegir/compare/v13.0.5...v13.0.6) (2018-03-08)


### Bug Fixes

* make a single webpack bundle ([f1e2850](https://github.com/ipfs/aegir/commit/f1e2850))



<a name="13.0.5"></a>
## [13.0.5](https://github.com/ipfs/aegir/compare/v13.0.4...v13.0.5) (2018-02-19)



<a name="13.0.4"></a>
## [13.0.4](https://github.com/ipfs/aegir/compare/v13.0.3...v13.0.4) (2018-02-19)



<a name="13.0.3"></a>
## [13.0.3](https://github.com/ipfs/aegir/compare/v13.0.2...v13.0.3) (2018-02-19)



<a name="13.0.2"></a>
## [13.0.2](https://github.com/ipfs/aegir/compare/v13.0.0...v13.0.2) (2018-02-19)


### Bug Fixes

* add a more descriptive error ([1174cd8](https://github.com/ipfs/aegir/commit/1174cd8))
* throw an error if fixture is not found ([a8907b9](https://github.com/ipfs/aegir/commit/a8907b9))



<a name="13.0.1"></a>
## [13.0.1](https://github.com/ipfs/aegir/compare/v13.0.0...v13.0.1) (2018-02-19)


### Bug Fixes

* add a more descriptive error ([1174cd8](https://github.com/ipfs/aegir/commit/1174cd8))
* throw an error if fixture is not found ([a8907b9](https://github.com/ipfs/aegir/commit/a8907b9))



<a name="13.0.0"></a>
# [13.0.0](https://github.com/ipfs/aegir/compare/v12.4.0...v13.0.0) (2018-02-12)


### Features

* (BREAKING CHANGE) allow to load fixtures from paths other than ./test ([#196](https://github.com/ipfs/aegir/issues/196)) ([66d9950](https://github.com/ipfs/aegir/commit/66d9950))



<a name="12.4.0"></a>
# [12.4.0](https://github.com/ipfs/aegir/compare/v12.3.0...v12.4.0) (2018-01-24)


### Features

* run pre-push targets if there are any ([858c1fd](https://github.com/ipfs/aegir/commit/858c1fd)), closes [#188](https://github.com/ipfs/aegir/issues/188)



<a name="12.3.0"></a>
# [12.3.0](https://github.com/ipfs/aegir/compare/v12.2.0...v12.3.0) (2017-12-18)


### Bug Fixes

* **release:** correctly run tests on release ([e7b544a](https://github.com/ipfs/aegir/commit/e7b544a)), closes [#172](https://github.com/ipfs/aegir/issues/172)
* process.env inacessible in browser tests ([2ca2863](https://github.com/ipfs/aegir/commit/2ca2863))
* update uglify config to not compress (and mess with js-ipfs) ([17a28a6](https://github.com/ipfs/aegir/commit/17a28a6))
* use rel paths on windows ([#183](https://github.com/ipfs/aegir/issues/183)) ([d57dd3f](https://github.com/ipfs/aegir/commit/d57dd3f))
* **test:** inject missing webpack config into tests ([bb4c0e4](https://github.com/ipfs/aegir/commit/bb4c0e4))


### Features

* **test:** output junit reports on CI ([61ab915](https://github.com/ipfs/aegir/commit/61ab915))



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



