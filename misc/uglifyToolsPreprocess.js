'use strict'

const fs = require('fs')
const path = require('path')
const PATH = require.resolve('../node_modules/uglify-es/tools/node.js')
const RE = /(\[\n[ "\n.\/a-z,-]+\])/gmi // regex: the solution for everything

let c = fs.readFileSync(PATH).toString()
c = c.replace(RE, (_, ar) => {
  ar = JSON.parse(ar.replace(',\n]', ']')).map(a => path.resolve(path.dirname(PATH), a)).map(file => fs.readFileSync(file, "utf8"))
  return JSON.stringify(ar)
}).replace('return fs.readFileSync(file, "utf8");', 'return file;').replace('return require.resolve(file);', 'return file;')

fs.writeFileSync(path.dirname(__dirname) + '/tmp/uglifyEsTools.js', c)
