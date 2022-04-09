import path from 'path'
import { execa } from 'execa'
import merge from 'merge-options'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('../types').TestOptions} TestOptions
 * @typedef {import('../types').GlobalOptions} GlobalOptions
 */

/**
 *
 * @param {TestOptions & GlobalOptions} argv
 * @param {ExecaOptions} execaOptions
 */
export default async (argv, execaOptions) => {
  const AVDName = 'aegir-android-29'
  const extra = argv['--'] ? argv['--'] : []
  const emulator = process.env.CI ? [] : ['--emulator', AVDName]
  const forwardOptions = /** @type {string[]} */([
    ...extra,
    argv.timeout && `--timeout=${argv.timeout}`,
    argv.grep && `--grep=${argv.grep}`,
    argv.bail && '--bail'
  ].filter(Boolean))
  const files = argv.files.length > 0
    ? argv.files
    : [
        'test/**/*.spec.{js,ts,cjs,mjs}',
        'test/browser.{js,ts,cjs,mjs}'
      ]

  // before hook
  const before = await argv.fileConfig.test.before(argv)
  const beforeEnv = before && before.env ? before.env : {}

  await checkAndroidEnv()

  if (!await checkAvd(AVDName)) {
    await execa('avdmanager', [
      'create',
      'avd',
      '-n', AVDName,
      '-d', 'pixel',
      '--package', 'system-images;android-29;default;x86_64'
    ])
  }

  // run pw-test
  await execa('rn-test',
    [
      ...files,
      '--platform', argv.runner === 'react-native-android' ? 'android' : 'ios',
      ...emulator,
      '--reset-cache',
      ...forwardOptions
    ],
    merge(
      {
        env: {
          AEGIR_RUNNER: argv.runner,
          NODE_ENV: process.env.NODE_ENV || 'test',
          ...beforeEnv
        },
        preferLocal: true,
        localDir: path.join(__dirname, '../..'),
        stdio: 'inherit'
      },
      execaOptions
    )
  )

  // after hook
  await argv.fileConfig.test.after(argv, before)
}

/**
 * Check for avd
 *
 * @param {string} name
 */
async function checkAvd (name) {
  const avd = await execa('emulator', ['-list-avds'])

  return avd.stdout.split('\n').includes(name)
}

async function checkAndroidEnv () {
  if (!process.env.ANDROID_SDK_ROOT) {
    throw new Error('ANDROID_SDK_ROOT is not set')
  }

  try {
    await execa('emulator', ['-help'])
    // await execa('sdkmanager')
    await execa('avdmanager', ['list'])
  } catch (/** @type {any} */ err) {
    throw new Error(`"Command ${err.path}" is not available, you need to properly setup your android environment.`)
  }
}
