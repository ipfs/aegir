'use strict'

require('@babel/register')({
  extensions: ['.ts'],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        bugfixes: true,
        targets: { node: true }
      }
    ],
    [
      '@babel/preset-typescript',
      {
        allowNamespaces: true
      }
    ]
  ]
})
