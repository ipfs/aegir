import { loadUserConfig } from './user.js'

const defaultBrowserConfig = {
  config: {
    buildConfig: {
      conditions: ['production']
    }
  }
}

export default async () => {
  const userConfig = await loadUserConfig()

  return userConfig.test?.browser?.config || defaultBrowserConfig
}
