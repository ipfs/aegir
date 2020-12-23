'use strict'
const { Converter } = require('typedoc/dist/lib/converter')
const path = require('path')
const fs = require('fs')

module.exports = function (PluginHost) {
  const app = PluginHost.owner
  const pkg = path.join(process.cwd(), 'package.json')
  let pkgJson
  let main
  try {
    pkgJson = JSON.parse(fs.readFileSync(pkg).toString())
    main = path.join(process.cwd(), pkgJson.main)
  } catch (err) {
    throw new Error('cant find package.json')
  }

  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, reflection, node) => {
    if (reflection.kind === 1 && node) {
      // entry point
      if (pkgJson && reflection.name === main) {
        reflection.name = '\u0000' + pkgJson.name.charAt(0).toUpperCase() + pkgJson.name.slice(1)
        // reflection.kind = 2
      }

      if (pkgJson && reflection.name.includes('dist/src/index.d.ts')) {
        reflection.name = '\u0000' + pkgJson.name.charAt(0) + pkgJson.name.slice(1)
      }

      if (pkgJson && reflection.name.includes('.d.ts')) {
        reflection.name = reflection.name.replace('.d.ts', '.js')
      }

      if (pkgJson && reflection.name.includes('dist/')) {
        reflection.name = reflection.name.replace('dist/', '')
      }
    }
  })
}
