import { loadUserConfig } from './user.js'

export default async () => {
  const userConfig = await loadUserConfig()

  return userConfig.test.browser.config || {}
}
