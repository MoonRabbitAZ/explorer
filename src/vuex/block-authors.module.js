import { vuexTypes } from '@/vuex/types'
import { api } from '@api'
import { isFunction, formatNumber } from '@polkadot/util'

const MAX_HEADERS = 75

export const state = {
  lastHeaders: [],
  eraPoints: {},
  lastBlockByAuthors: [],
  lastBlockNumber: '',
  lastHeader: {},
  blockNumbersByAuthors: {},
}

export const mutations = {
  [vuexTypes.SET_LAST_HEADERS] (state, lastHeaders) {
    state.lastHeaders = lastHeaders
  },
  [vuexTypes.SET_BLOCK_NUMBER_BY_AUTHOR] (state, { author, blockNumber }) {
    state.blockNumbersByAuthors[author] = blockNumber
  },
  [vuexTypes.SET_LAST_BLOCK_NUMBER] (state, lastBlockNumber) {
    state.lastBlockNumber = lastBlockNumber
  },
  [vuexTypes.SET_LAST_HEADER] (state, lastHeader) {
    state.lastHeader = lastHeader
  },
  [vuexTypes.PUSH_LAST_BLOCK_AUTHORS] (state, lastBlockAuthors) {
    state.lastBlockAuthors = lastBlockAuthors
  },
  [vuexTypes.SET_ERA_POINTS_BY_ACCOUNT_ID] (state, { accountId, points }) {
    state.eraPoints[accountId] = points
  },
  [vuexTypes.DELETE_ERA_POINTS_BY_ACCOUNT_ID] (state, accountId) {
    delete state.eraPoints[accountId]
  },
}

export const actions = {
  async [vuexTypes.BLOCK_AUTHORS_HANDLER] (
    { commit, dispatch, state }, lastHeader,
  ) {
    if (lastHeader.number) {
      commit(vuexTypes.SET_LAST_HEADER, lastHeader)

      const blockNumber = lastHeader.number.unwrap()
      let thisBlockAuthor = ''
      const isAuthorMapping = isFunction(api.query.authorMapping?.mapping)

      if (lastHeader.author) {
        thisBlockAuthor = lastHeader.author.toString()
      } else if (
        isAuthorMapping &&
        lastHeader.digest.logs &&
        lastHeader.digest.logs[0] &&
        lastHeader.digest.logs[0].isConsensus &&
        lastHeader.digest.logs[0].asConsensus[1]
      ) {
        thisBlockAuthor = (await api.query.authorMapping
          .mapping(lastHeader.digest.logs[0].asConsensus[1]))
          .toString()
        lastHeader.authorFromMapping = thisBlockAuthor
      }

      const thisBlockNumber = Number(blockNumber)

      if (thisBlockAuthor) {
        commit(vuexTypes.PUSH_LAST_BLOCK_AUTHORS,
          [...state.lastBlockByAuthors, thisBlockAuthor])
        commit(vuexTypes.SET_BLOCK_NUMBER_BY_AUTHOR, {
          author: thisBlockAuthor,
          blockNumber: thisBlockNumber,
        })

        if (thisBlockNumber !== state.lastBlockNumber) {
          commit(vuexTypes.SET_LAST_BLOCK_NUMBER, thisBlockNumber)
        }
      }

      const lastHeaders = state.lastHeaders.filter((old, index) =>
        index < MAX_HEADERS && old.number.unwrap().lt(blockNumber))
        .reduce((next, header) => {
          next.push(header)

          return next
        }, [lastHeader])
        .sort((a, b) => b.number.unwrap().cmp(a.number.unwrap()))

      commit(vuexTypes.SET_LAST_HEADERS, lastHeaders)
    }
  },

  async [vuexTypes.SUBSCRIBE_ERA_POINTS] ({ commit, state }) {
    api.derive.staking?.currentPoints((points) => {
      const current = Object.keys(state.eraPoints)
      const entries = [...points.individual.entries()]
        .map(([accountId, points]) =>
          [accountId.toString(), formatNumber(points)],
        )
      if (current.length !== entries.length) {
        current.forEach((accountId) => {
          commit(vuexTypes.DELETE_ERA_POINTS_BY_ACCOUNT_ID, accountId)
        })
      }

      entries.forEach(([accountId, points]) => {
        commit(vuexTypes.SET_ERA_POINTS_BY_ACCOUNT_ID, { points, accountId })
      })
    })
  },
}

export const getters = {
  [vuexTypes.lastHeaders]: state => state.lastHeaders,
  [vuexTypes.eraPoints]: state => state.eraPoints,
  [vuexTypes.lastBlockAuthors]: state => state.lastBlockAuthors,
  [vuexTypes.lastBlockNumber]: state => state.lastBlockNumber,
  [vuexTypes.lastHeader]: state => state.lastHeader,
  [vuexTypes.blockNumbersByAuthors]: state => state.blockNumbersByAuthors,
  [vuexTypes.blockNumberByAuthor]: (_, getters) => address =>
    getters[vuexTypes.blockNumbersByAuthors][address] || '',
}

export default {
  state,
  mutations,
  actions,
  getters,
}
