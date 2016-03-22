# dignified.js

> Because sometimes you want to get on with writing code and not
> think about your toolchain again.


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
