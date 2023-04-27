/* eslint-disable no-console */

import Listr from 'listr'
import { rimraf } from 'rimraf'

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 */

export default new Listr([
  {
    title: 'clean',

    /**
     *
     * @param {GlobalOptions & { files: string[] }} ctx
     */
    task: async (ctx) => {
      await Promise.all(
        ctx.files.map(pattern => rimraf(pattern, {
          glob: true
        }))
      )
    }
  }
], { renderer: 'verbose' })
