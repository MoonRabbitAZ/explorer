import { vuexTypes } from '@/vuex/types'

export const state = {
  apiDefaultTx: _ => {},
  apiDefaultTxSudo: _ => {},
  specName: '',
  specVersion: '',
  systemName: '',
  systemChain: '',
  systemVersion: '',
  isEthereum: '',
}

export const mutations = {
  [vuexTypes.SET_API_DEFAULT_TX] (state, apiDefaultTx) {
    state.apiDefaultTx = apiDefaultTx
  },
  [vuexTypes.SET_API_DEFAULT_TX_SUDO] (state, apiDefaultTxSudo) {
    state.apiDefaultTxSudo = apiDefaultTxSudo
  },
  [vuexTypes.SET_SPEC_NAME] (state, specName) {
    state.specName = specName
  },
  [vuexTypes.SET_SPEC_VERSION] (state, specVersion) {
    state.specVersion = specVersion
  },
  [vuexTypes.SET_SYSTEM_NAME] (state, systemName) {
    state.systemName = systemName
  },
  [vuexTypes.SET_SYSTEM_CHAIN] (state, systemChain) {
    state.systemChain = systemChain
  },
  [vuexTypes.SET_SYSTEM_VERSION] (state, systemVersion) {
    state.systemVersion = systemVersion
  },
  [vuexTypes.SET_IS_ETHEREUM] (state, isEthereum) {
    state.isEthereum = isEthereum
  },
}

export const actions = {
  [vuexTypes.SET_APP_STATE] ({ commit }, data) {
    commit(vuexTypes.SET_API_DEFAULT_TX, data.apiDefaultTx)
    commit(vuexTypes.SET_API_DEFAULT_TX_SUDO, data.apiDefaultTxSudo)
    commit(vuexTypes.SET_SPEC_NAME, data.specName)
    commit(vuexTypes.SET_SPEC_VERSION, data.specVersion)
    commit(vuexTypes.SET_SYSTEM_NAME, data.systemName)
    commit(vuexTypes.SET_SYSTEM_CHAIN, data.systemChain)
    commit(vuexTypes.SET_SYSTEM_VERSION, data.systemVersion)
    commit(vuexTypes.SET_IS_ETHEREUM, data.isEthereum)
  },
}

export const getters = {
  [vuexTypes.apiDefaultTx]: state => state.apiDefaultTx,
  [vuexTypes.apiDefaultTxSudo]: state => state.apiDefaultTxSudo,
  [vuexTypes.specName]: state => state.specName,
  [vuexTypes.specVersion]: state => state.specVersion,
  [vuexTypes.systemName]: state => state.systemName,
  [vuexTypes.systemChain]: state => state.systemChain,
  [vuexTypes.systemVersion]: state => state.systemVersion,
  [vuexTypes.isEthereum]: state => state.isEthereum,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
