'use strict'

const execa = require('execa')
const prompt = require('prompt-promise')

function publish () {
  return execa('npm', ['publish'])
    .catch(error => {
      if (error.toString().includes('provide a one-time password')) {
        return prompt.password('Enter an npm OTP: ')
          .then(otp => execa('npm', ['publish', '--otp', otp.trim()]))
      }

      throw error
    })
}

module.exports = publish
