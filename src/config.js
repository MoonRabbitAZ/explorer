import packageJson from '../package.json'
import _isEmpty from 'lodash/isEmpty'

const config = {}

const env = _isEmpty(document.ENV) ? process.env : document.ENV

const normalize = value => {
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}

Object.keys(env).forEach(varName => {
  const value = normalize(env[varName])

  if (varName.startsWith('VUE_APP')) {
    const key = varName.replace('VUE_APP_', '')
    config[key] = value
  } else {
    config[varName] = value
  }
})

export default Object.assign(
  {
    APP_NAME: 'Moon Rabbit',

    STORAGE_KEY: 'moon-rabbit-storage',

    BUILD_VERSION: packageJson.version,

    WSS_NODE: 'wss://kusama.api.onfinality.io/public-ws',

    BRIDGE_API_URL: 'https://bridge.hole.moonrabbit.com/',

    STAKING_API_URL: 'https://staking.polkadot.tokend.io/',

    STAKING_SYSTEM_ADDRESS: 'GsvVmjr1CBHwQHw84pPHMDxgNY3iBLz6Qn7qS3CH8qPhrHz',
  },

  // process.env
  process.env
    ? config
    : process.env,
  document.ENV
    ? config
    : document.ENV,
)
