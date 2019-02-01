'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// git-validate common hash for pre-commit and pre-push 3d4e3b719e1f9e93e9d97315bda564ea2f8d8ebcd255ed5a9809e9525281dd9d
const hooksList = [
  ['.git/hooks/pre-commit', '3d4e3b719e1f9e93e9d97315bda564ea2f8d8ebcd255ed5a9809e9525281dd9d'],
  ['.git/hooks/pre-push', '3d4e3b719e1f9e93e9d97315bda564ea2f8d8ebcd255ed5a9809e9525281dd9d']
]

hooksList.forEach(([hook, fileHash]) => {
  const filePath = path.join(process.cwd(), hook)
  const hash = crypto.createHash('sha256')
  try {
    const input = fs.createReadStream(filePath)
    input.on('readable', () => {
      const data = input.read()
      if (data) {
        hash.update(data)
      } else {
        if (hash.digest('hex') === fileHash) {
          console.log(`Deleting git hook: ${filePath}`)
        }
      }
    })
  } catch (err) {
    fs.unlinkSync(filePath)
    console.error(`Something went wrong deleting ${filePath}`, err)
  }
})
