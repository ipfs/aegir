# dignified.js

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Dependency Status](https://david-dm.org/dignifiedquire/dignified.js.svg?style=flat-square)](https://david-dm.org/dignifiedquire/dignified.js)
[![Travis CI](https://travis-ci.org/dignifiedquire/dignified.js.svg?branch=master)](https://travis-ci.org/dignifiedquire/dignified.js)

> Because sometimes you want to get on with writing code and not
> think about your toolchain again.

There is a badge.

```markdown
[![dignified.js](https://img.shields.io/badge/follows-dignified.js-blue.svg?style=flat-square)](https://github.com/dignifiedquire/dignified.js)
```

## Linting

## Testing

## Building

## Releasing


## Releases

1. Run linting
2. Run tests
3. Build everything
4. Bump the version in `package.json`
5. Commit the version change
6. Create a git tag
7. Run `git push` to `upstream/master`

```bash
# Major release
$ gulp release major
$ dignified-release major
# Minor relase
$ gulp release minor
$ dignified-release minor
# Patch release
$ gulp release
$ dignified-release
```
