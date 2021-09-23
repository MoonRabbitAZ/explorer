import packageJson from '../package.json'

export const CONFIG = Object.freeze({
  APP_NAME: 'Moon Rabbit',

  STORAGE_KEY: 'moon-rabbit-storage',

  BUILD_VERSION: packageJson.version,

  // WSS_NODE: 'wss://node.polkadot.tokend.io',
  WSS_NODE: 'wss://kusama.api.onfinality.io/public-ws',

  API_URL: 'https://bridge.hole.moonrabbit.com/',
})
