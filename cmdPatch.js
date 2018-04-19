#!/usr/bin/env node

'use strict'

let pref = '_yargs_require'
let id = 0
let getId = () => pref + id++

// self.command = function (cmd (command), description, builder, handler, middlewares) {
const template = (p, id) => `.command(${id}.command, ${id}.describe || ${id}.description, ${id}.builder || _builderNOOP, ${id}.handler, ${id}.middlewares)\n`
const templateH = (p, id) => `const ${id} = require('${p}')`


const fs = require('fs')
const path = require('path')

const main = path.dirname(__dirname)

const read = p => fs.readFileSync(p).toString()
const RE = /\.commandDir\('([a-z]+)'\)/gmi

function replace(P, D) {
  const out = P.replace('.js', '_patched.js')
  let c = read(P)
  let define = []
  if (c.startsWith('#!')) c = c.split('\n').slice(1).join('\n')
  c = c.replace(RE, (_, d) => {
    console.log('[%s]: dir %s', path.relative(main, P), d)
    let out = ''
    let D2 = path.join(D, d)
    fs.readdirSync(D2).forEach(file => {
      if (file.match(/^.+\.js$/) && !file.match(/^.+_patched\.js$/)) {
        let p = path.join(d, file)
        let p2 = p.replace('.js', '_patched.js')
        const P2 = './' + path.relative(path.dirname(P), path.join(D, p2))
        let id = getId()
        out += template(P2, id)
        define.push([P2, id])
        replace(path.join(D, p), D2)
      }
    })
    return out
  })
  if (define.length) c = c.replace("'use strict'", "'use strict'\nconst _builderNOOP = y => y\n" + define.map(a => templateH(...a)).join('\n') + '\n')
  console.log('[%s]: Patched!', path.relative(main, P))
  fs.writeFileSync(out, c)
}

replace(require.resolve('./cli.js'), path.dirname(require.resolve('./cli.js')))
