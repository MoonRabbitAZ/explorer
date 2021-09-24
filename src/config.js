import packageJson from '../package.json'

export const CONFIG = Object.freeze({
  APP_NAME: 'Moon Rabbit',

  STORAGE_KEY: 'moon-rabbit-storage',

  BUILD_VERSION: packageJson.version,

  WSS_NODE: 'wss://node.polkadot.tokend.io',

  BRIDGE_API_URL: 'https://bridge.hole.moonrabbit.com/',

  STAKING_API_URL: 'https://staking.polkadot.tokend.io/',

  STAKING_SYSTEM_ADDRESS: 'GsvVmjr1CBHwQHw84pPHMDxgNY3iBLz6Qn7qS3CH8qPhrHz',
})
