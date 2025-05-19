#! /usr/bin/env node
/* eslint-disable no-console */

import { readPackageUpSync } from 'read-pkg-up'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import alignVersionsCmd from './cmds/align-versions.js'
import buildCmd from './cmds/build.js'
import checkProjectCmd from './cmds/check-project.js'
import checkCmd from './cmds/check.js'
import cleanCmd from './cmds/clean.js'
import dependencyCheckCmd from './cmds/dependency-check.js'
import docsCmd from './cmds/docs.js'
import docVerifyCmd from './cmds/document-check.js'
import execCmd from './cmds/exec.js'
import lintPackageJsonCmd from './cmds/lint-package-json.js'
import lintCmd from './cmds/lint.js'
import releaseRcCmd from './cmds/release-rc.js'
import releaseCmd from './cmds/release.js'
import runCmd from './cmds/run.js'
import spellCheckCmd from './cmds/spell-check.js'
import testDependantCmd from './cmds/test-dependant.js'
import testCmd from './cmds/test.js'
import { loadUserConfig } from './config/user.js'

/**
 * @typedef {import('./types.js').BuildOptions} BuildOptions
 * @typedef {import('./types.js').DependencyCheckOptions} DependencyCheckOptions
 * @typedef {import('./types.js').DocsOptions} DocsOptions
 * @typedef {import('./types.js').GlobalOptions} GlobalOptions
 * @typedef {import('./types.js').LintOptions} LintOptions
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').PartialOptions} PartialOptions
 * @typedef {import('./types.js').ReleaseOptions} ReleaseOptions
 * @typedef {import('./types.js').TSOptions} TSOptions
 * @typedef {import('./types.js').TestOptions} TestOptions
 */

process.on('unhandledRejection', (err) => {
  throw err
})

async function main () {
  const pkg = readPackageUpSync()

  if (!pkg) {
    throw new Error('Could not read package.json')
  }

  const userConfig = await loadUserConfig()

  const res = yargs(hideBin(process.argv))
    .scriptName('aegir')
    .env('AEGIR')
    .usage('Usage: $0 <command> [options]')
    .example('$0 build', 'Runs the build command to bundle JS code for the browser.')
    .example('npx $0 build', 'Can be used with `npx` to use a local version')
    .example('$0 test -t webworker -- --browser firefox', 'If the command supports `--` can be used to forward options to the underlying tool.')
    .example('npm test -- -- --browser firefox', 'If `npm test` translates to `aegir test -t browser` and you want to forward options you need to use `-- --` instead.')
    .epilog('Use `$0 <command> --help` to learn more about each command.')
    .middleware((yargs) => {
      yargs.fileConfig = userConfig
    })
    .help()
    .alias('help', 'h')
    .alias('version', 'v')
    .option('debug', {
      desc: 'Show debug output.',
      type: 'boolean',
      alias: 'd',
      default: userConfig.debug
    })
    .group(['help', 'version', 'debug'], 'Global Options:')
    .demandCommand(1, 'You need at least one command.')
    // .wrap(yargs.terminalWidth())
    .parserConfiguration({ 'populate--': true })
    .recommendCommands()
    .completion()
    .strictCommands()
    .fail(false)

  res.command(buildCmd)
  res.command(checkProjectCmd)
  res.command(checkCmd)
  res.command(cleanCmd)
  res.command(dependencyCheckCmd)
  res.command(docsCmd)
  res.command(docVerifyCmd)
  res.command(lintPackageJsonCmd)
  res.command(lintCmd)
  res.command(releaseCmd)
  res.command(releaseRcCmd)
  res.command(testDependantCmd)
  res.command(testCmd)
  res.command(execCmd)
  res.command(runCmd)
  res.command(alignVersionsCmd)
  res.command(spellCheckCmd)

  try {
    await res.parse()
  } catch (/** @type {any} */ err) {
    if (res.parsed && res.parsed.argv.debug) {
      console.error('\n', err)
    } else {
      console.error(err.message)
    }

    process.exit(1)
  }
}

main()
