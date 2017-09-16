'use strict'

const _ = require('lodash')
const Joi = require('joi')
const promisify = require('es6-promisify')
const path = require('path')

const utils = require('../utils')

const hookSchema = Joi.object().keys({
  pre: Joi.func(),
  post: Joi.func()
}).unknown(false)

const envSchema = Joi.object().keys({
  browser: hookSchema,
  node: hookSchema
}).unknown(false)

const HOOK_ENVS = [
  'browser',
  'node'
]

const HOOK_STAGES = [
  'pre',
  'post'
]

function promisifyHooks (hooks) {
  Object.keys(hooks).forEach((key) => {
    hooks[key] = promisify(hooks[key])
  })

  return hooks
}

function normalizeHooks (hooks) {
  const keys = Object.keys(hooks)

  // no hooks provided
  if (keys.length === 0) {
    return hooks
  }

  // same hooks for all envs
  if (_.every(keys, (k) => _.includes(HOOK_STAGES, k))) {
    const v = promisifyHooks(Joi.attempt(hooks, hookSchema))

    const res = {}
    HOOK_ENVS.forEach((env) => {
      res[env] = v
    })

    return res
  }

  // regular per env hook specification
  if (_.every(keys, (k) => _.includes(HOOK_ENVS, k))) {
    const res = Joi.attempt(hooks, envSchema)
    keys.forEach((key) => {
      res[key] = promisifyHooks(res[key])
    })
    return res
  }

  throw new Error(`Found unknown keys in hook definiton: "${keys.join(' ')}"`)
}

function userConfig () {
  const config = utils.getUserConfig()

  const user = _.defaultsDeep({}, config, {
    webpack: {},
    karma: {},
    hooks: {},
    entry: path.join(process.cwd(), 'src/index.js')
  })

  user.hooks = normalizeHooks(user.hooks)

  return user
}

module.exports = userConfig
