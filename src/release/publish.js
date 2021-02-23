'use strict'

const execa = require('execa')
const { otp } = require('../utils')
/**
 * @typedef {import('./../types').ReleaseOptions} ReleaseOptions
 * @typedef {import('listr').ListrTaskWrapper} ListrTask
 */

/**
 * @param {{ distTag: ReleaseOptions["distTag"], type: ReleaseOptions["type"] }} ctx
 * @param {ListrTask} task
 */
function publish (ctx, task) {
  let publishArgs = ['publish']
  let distTag = ctx.distTag

  // Prevent accidental publish of prerelease to "latest"
  if (ctx.type.startsWith('pre') && distTag === 'latest') {
    distTag = 'next'
  }

  if (distTag) {
    publishArgs = publishArgs.concat('--tag', distTag)
    task.title += ` (npm ${publishArgs.join(' ')})`
  }

  return execa('npm', publishArgs)
    .catch(async (error) => {
      if (error.toString().includes('provide a one-time password')) {
        const code = await otp()
        task.title += '. Trying again with OTP.'
        return await execa('npm', publishArgs.concat('--otp', code))
      }

      throw error
    })
}

module.exports = publish
