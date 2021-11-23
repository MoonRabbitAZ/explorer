import Web3 from 'web3'

import { vuexTypes } from '@/vuex/types'
import { errors } from '@/js/errors'

export const state = {
  web3: {},
  account: '',
  chainId: '',
}

export const mutations = {
  [vuexTypes.SET_WEB3_INSTANCE] (state, web3) {
    state.web3 = web3
  },
  [vuexTypes.SET_WEB3_ACCOUNT] (state, account) {
    state.account = account
  },
  [vuexTypes.SET_WEB3_CHAIN_ID] (state, chainId) {
    state.chainId = chainId
  },
}

export const actions = {
  async [vuexTypes.INIT_WEB3] ({ commit, dispatch, getters }) {
    const { ethereum } = window

    if (!ethereum || getters[vuexTypes.isMetamaskEnabled]) return

    commit(vuexTypes.SET_WEB3_INSTANCE, new Web3(ethereum))
    commit(vuexTypes.SET_WEB3_CHAIN_ID, ethereum.chainId)

    ethereum.on('accountsChanged', () => {
      dispatch(vuexTypes.LOAD_WEB3_ACCOUNT)
    })

    ethereum.on('chainChanged', (chainId) => {
      commit(vuexTypes.SET_WEB3_CHAIN_ID, chainId)
    })
    await dispatch(vuexTypes.LOAD_WEB3_ACCOUNT)
  },

  async [vuexTypes.CONNECT_WEB3] ({ commit, dispatch }) {
    const { ethereum } = window
    if (ethereum) {
      await dispatch(vuexTypes.INIT_WEB3)
      await ethereum.request({ method: 'eth_requestAccounts' })
      await dispatch(vuexTypes.LOAD_WEB3_ACCOUNT)
    } else {
      throw new errors.MetamaskNotFoundError()
    }
  },

  async [vuexTypes.LOAD_WEB3_ACCOUNT] ({ commit, getters }) {
    const web3 = getters[vuexTypes.web3]
    const accounts = await web3.eth.getAccounts()
    commit(vuexTypes.SET_WEB3_ACCOUNT, accounts[0])
  },
}

export const getters = {
  [vuexTypes.web3]: state => state.web3,
  [vuexTypes.web3Account]: state => state.account,
  [vuexTypes.web3ChainId]: state => state.chainId,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
