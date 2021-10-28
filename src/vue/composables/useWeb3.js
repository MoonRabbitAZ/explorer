import { computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

const MAIN_CHAIN_ID = '0x1'
const RINKEBY_CHAIN_ID = '0x4'
const MAIN_NETWORK_TYPE = 'main'

export function useWeb3 () {
  const store = useStore()

  const web3 = computed(() => store.getters[vuexTypes.web3])
  const web3Account = computed(() => store.getters[vuexTypes.web3Account])
  const web3ChainId = computed(() => store.getters[vuexTypes.web3ChainId])
  const isMetamaskConnected = computed(() => Boolean(web3Account.value))
  const isMetamaskEnabled = computed(() => Boolean(web3.value.eth))
  const isCorrectNetwork = computed(() =>
    config.ETHEREUM_NETWORK_TYPE === MAIN_NETWORK_TYPE
      ? web3ChainId.value === MAIN_CHAIN_ID
      : web3ChainId.value === RINKEBY_CHAIN_ID,
  )

  async function connectWeb3 () { await store.dispatch(vuexTypes.CONNECT_WEB3) }

  async function initWeb3 () { await store.dispatch(vuexTypes.INIT_WEB3) }

  async function loadWeb3Account () {
    await store.dispatch(vuexTypes.LOAD_WEB3_ACCOUNT)
  }

  return {
    web3,
    web3Account,
    web3ChainId,
    isMetamaskConnected,
    isMetamaskEnabled,
    isCorrectNetwork,
    connectWeb3,
    initWeb3,
    loadWeb3Account,
  }
}
