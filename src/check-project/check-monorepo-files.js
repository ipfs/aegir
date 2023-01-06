/* eslint-disable no-console */

/**
 * @param {string} projectDir
 */
export async function checkMonorepoFiles (projectDir) {
  console.info('Check monorepo files')

  // we don't need any special files since npm has workspace support,
  // but if we did, they'd be set up here
}
