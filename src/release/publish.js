'use strict'

const execa = require('execa')
const prompt = require('prompt-promise')

function publish (ctx, task) {
  let publishArgs = ['publish']
  let distTag = ctx['dist-tag']

  // Prevent accidental publish of prerelease to "latest"
  if (ctx.type.startsWith('pre') && !distTag) {
    distTag = 'next'
  }

  if (distTag) {
    publishArgs = publishArgs.concat('--tag', distTag)
    task.title += ` (npm ${publishArgs.join(' ')})`
  }

  return execa('npm', publishArgs)
    .catch(error => {
      if (error.toString().includes('provide a one-time password')) {
        return prompt.password('Enter an npm OTP: ')
          .then(otp => execa('npm', publishArgs.concat('--otp', otp.trim())))
      }

      throw error
    })
}

module.exports = publish
