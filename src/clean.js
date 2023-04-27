/* eslint-disable no-console */

import { promisify } from 'util'
import Listr from 'listr'
import rm from 'rimraf'

const rimraf = promisify(rm)

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
        ctx.files.map(pattern => rimraf(pattern))
      )
    }
  }
], { renderer: 'verbose' })
