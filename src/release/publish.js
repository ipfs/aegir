'use strict'

const execa = require('execa')
const prompt = require('prompt-promise')

function publish (ctx, task) {
  let publishArgs = ['publish']

  if (ctx['dist-tag']) {
    publishArgs = publishArgs.concat('--tag', ctx['dist-tag'])
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
