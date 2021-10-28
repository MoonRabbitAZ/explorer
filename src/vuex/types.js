const mutations = {
  // root
  POP_STATE: 'POP_STATE',
  CLEAR_STATE: 'CLEAR_STATE',

  // app
  SET_API_DEFAULT_TX: 'SET_API_DEFAULT_TX',
  SET_API_DEFAULT_TX_SUDO: 'SET_API_DEFAULT_TX_SUDO',
  SET_SPEC_NAME: 'SET_SPEC_NAME',
  SET_SPEC_VERSION: 'SET_SPEC_VERSION',
  SET_SYSTEM_NAME: 'SET_SYSTEM_NAME',
  SET_SYSTEM_CHAIN: 'SET_SYSTEM_CHAIN',
  SET_SYSTEM_VERSION: 'SET_SYSTEM_VERSION',
  SET_IS_ETHEREUM: 'SET_IS_ETHEREUM',

  // block authors
  SET_LAST_HEADERS: 'SET_LAST_HEADERS',
  SET_BLOCK_NUMBER_BY_AUTHOR: 'SET_BLOCK_NUMBER_BY_AUTHOR',
  SET_LAST_BLOCK_NUMBER: 'SET_LAST_BLOCK_NUMBER',
  SET_LAST_HEADER: 'SET_LAST_HEADER',
  PUSH_LAST_BLOCK_AUTHORS: 'PUSH_LAST_BLOCK_AUTHORS',
  SET_ERA_POINTS_BY_ACCOUNT_ID: 'SET_ERA_POINTS_BY_ACCOUNT_ID',
  DELETE_ERA_POINTS_BY_ACCOUNT_ID: 'DELETE_ERA_POINTS_BY_ACCOUNT_ID',

  // events
  SET_EVENTS: 'SET_EVENTS',
  SET_EVENT_COUNT: 'SET_EVENT_COUNT',
  SET_PREV_BLOCK_HASH: 'SET_PREV_BLOCK_HASH',
  SET_PREV_EVENT_HASH: 'SET_PREV_EVENT_HASH',
  SET_LAST_BLOCK_EVENTS: 'SET_LAST_BLOCK_EVENTS',

  // web3-provider
  SET_WEB3_INSTANCE: 'SET_WEB3_INSTANCE',
  SET_WEB3_ACCOUNT: 'SET_WEB3_ACCOUNT',
  SET_WEB3_CHAIN_ID: 'SET_WEB3_CHAIN_ID',
}

const actions = {
  // app
  SET_APP_STATE: 'SET_APP_STATE',

  // block authors
  BLOCK_AUTHORS_HANDLER: 'BLOCK_AUTHORS_HANDLER',
  SUBSCRIBE_ERA_POINTS: 'SUBSCRIBE_ERA_POINTS',

  // events
  SUBSCRIBE_EVENTS: 'SUBSCRIBE_EVENTS',

  // web3-provider
  INIT_WEB3: 'INIT_WEB3',
  LOAD_WEB3_ACCOUNT: 'LOAD_WEB3_ACCOUNT',
  CONNECT_WEB3: 'CONNECT_WEB3',
}

const getters = {
  // app
  apiDefaultTx: 'apiDefaultTx',
  apiDefaultTxSudo: 'apiDefaultTxSudo',
  specName: 'specName',
  specVersion: 'specVersion',
  systemName: 'systemName',
  systemChain: 'systemChain',
  systemVersion: 'systemVersion',
  isEthereum: 'isEthereum',

  // block authors
  lastHeaders: 'lastHeaders',
  eraPoints: 'eraPoints',
  lastBlockAuthors: 'lastBlockAuthors',
  lastBlockNumber: 'lastBlockNumber',
  lastHeader: 'lastHeader',
  blockNumbersByAuthors: 'blockNumbersByAuthors',
  blockNumberByAuthor: 'blockNumberByAuthor',

  // events
  events: 'events',
  eventCount: 'eventCount',
  pervBlockHash: 'pervBlockHash',
  pervEventHash: 'pervEventHash',
  lastBlockEvents: 'lastBlockEvents',

  // web3-provider
  web3: 'web3',
  web3Account: 'web3Account',
  web3ChainId: 'web3ChainId',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
