/* eslint-disable no-console */

import Listr from 'listr'
import path from 'path'
import { premove as del } from 'premove'

export default new Listr([
  {
    title: 'clean ./dist',
    task: async () => del(path.join(process.cwd(), 'dist'))
  }
], { renderer: 'verbose' })
