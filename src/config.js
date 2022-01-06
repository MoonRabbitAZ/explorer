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

    // WSS_NODE: 'wss://node.polkadot.tokend.io',
    WSS_NODE: 'wss://polkadot-rpc.dwellir.com',

    BRIDGE_API_URL: 'https://bridge.hole.moonrabbit.com/',

    STAKING_API_URL: 'https://staking.polkadot.tokend.io/',

    BRIDGE_ETHEREUM_API_URL: '',

    STAKING_SYSTEM_ADDRESS: 'GsvVmjr1CBHwQHw84pPHMDxgNY3iBLz6Qn7qS3CH8qPhrHz',

    /**
     * Default page limit for requests
     */

    DEFAULT_PAGE_LIMIT: 15,

    /**
     *  IPFS host to get Token URI from.
     */
    TOKEN_URI_HOST: 'gateway.ipfs.io/ipfs/',

    /**
     *  IPFS protocol to get Token URI.
     */
    TOKEN_URI_PROTOCOL: 'https',

    /**
     *  Link to open this site of the metamask mobile application
     * @see {@link https://metamask.github.io/metamask-deeplinks}
     */
    OPEN_METAMASK_MOBILE_APP_LINK: 'https://metamask.app.link/dapp/stage.hole.moonrabbit.com/bridge',

    /**
     *  Link terms of use
     */

    TERMS_OF_USE_LINK: 'https://moonrabbit.com/legal/',

    /**
     *  Link to documentation
     */

    LIBRARY_APP_LINK: 'https://lib.moonrabbit.com/',

    /**
     *  Data to connect the network to metamask
     */

    METAMASK_EVM_NETWORK_NAME: 'Moon Rabbit EVM',
    METAMASK_EVM_RPC_URL: 'https://evm.moonrabbit.com',
    METAMASK_EVM_CHAIN_ID: '1280',
    METAMASK_EVM_CURRENCY_SYMBOL: 'AAA',

    /**
     * Social links
     */
    SOCIAL_LINK_DISCORD: 'https://discord.com/invite/2deuZrmfBm',
    SOCIAL_LINK_FACEBOOK: 'https://www.facebook.com/moonrabbitAZ/',
    SOCIAL_LINK_GITHUB: 'https://github.com/MoonRabbitAZ',
    SOCIAL_LINK_INSTAGRAM: 'https://instagram.com/moonrabbitaz?utm_medium=copy_link',
    SOCIAL_LINK_LINKEDIN: 'https://www.linkedin.com/company/moonrabbitaz',
    SOCIAL_LINK_REDDIT: 'https://www.reddit.com/r/MoonRabbitAI/',
    SOCIAL_LINK_TWITTER: 'https://twitter.com/moonrabbitAZ',
    SOCIAL_LINK_COIN_MARKET_CAP: 'https://coinmarketcap.com/currencies/moon-rabbit/',
    SOCIAL_LINK_COIN_GECKO: 'https://www.coingecko.com/en/coins/moon-rabbit',
    SOCIAL_LINK_TELEGRAM_CN: 'https://t.me/moonrabbitzh',
    SOCIAL_LINK_TELEGRAM_MC: 'https://t.me/moonrabbitID',
    SOCIAL_LINK_TELEGRAM_KR: '',
    SOCIAL_LINK_TELEGRAM_JP: 'https://t.me/moonrabbitjp',
    SOCIAL_LINK_TELEGRAM_RU: 'https://t.me/moonrabbitru',
    SOCIAL_LINK_TELEGRAM_TR: 'https://t.me/MoonRabbitTR',
    SOCIAL_LINK_TELEGRAM_ENG: 'https://t.me/moonrabbitcom',
    SOCIAL_LINK_TELEGRAM_NEWS: 'https://t.me/moonrabbitchannel',
    SOCIAL_LINK_COMMUNITY: '',
    SOCIAL_LINK_BITCOIN_TALK: 'https://bitcointalk.org',
    SOCIAL_LINK_WEIBO: 'https://weibo.com/u/7616523840?refer_flag=1001030103_&is_all=1',

  },

  // process.env
  process.env
    ? config
    : process.env,
  document.ENV
    ? config
    : document.ENV,
)
