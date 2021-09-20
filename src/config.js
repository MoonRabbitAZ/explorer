import packageJson from '../package.json'

export const CONFIG = Object.freeze({
  APP_NAME: 'Moon Rabbit',

  STORAGE_KEY: 'moon-rabbit-storage',

  BUILD_VERSION: packageJson.version,

  WSS_NODE: 'wss://kusama-rpc.polkadot.io',

  API_URL: 'https://bridge.hole.moonrabbit.com/',
})
