import { vuexTypes } from '@/vuex/types'
import { api } from '@api'
import { stringToU8a, stringify } from '@polkadot/util'
import { xxhashAsHex } from '@polkadot/util-crypto'
import { EventWrapperRecord } from '@/js/records/event-wrapper.record'
import { BCH_EVENT_METHODS, BCH_EVENT_SECTION } from '@/js/const/blockchain-event.const'

const MAX_EVENTS = 75

export const state = {
  events: [],
  eventCount: 0,
  pervBlockHash: '',
  pervEventHash: '',
  lastBlockEvents: [],
}

export const mutations = {
  [vuexTypes.SET_EVENTS] (state, events) {
    state.events = events
  },
  [vuexTypes.SET_EVENT_COUNT] (state, eventCount) {
    state.eventCount = eventCount
  },
  [vuexTypes.SET_PREV_BLOCK_HASH] (state, pervBlockHash) {
    state.pervBlockHash = pervBlockHash
  },
  [vuexTypes.SET_PREV_EVENT_HASH] (state, pervEventHash) {
    state.pervEventHash = pervEventHash
  },
  [vuexTypes.SET_LAST_BLOCK_EVENTS] (state, lastBlockEvents) {
    state.lastBlockEvents = lastBlockEvents
  },
}

export const actions = {
  [vuexTypes.SUBSCRIBE_EVENTS] ({ commit, state }) {
    /* eslint-disable max-len */
    function filterEvent (method, section) {
      return section !== BCH_EVENT_SECTION.system &&
      (![BCH_EVENT_SECTION.balances, BCH_EVENT_SECTION.treasury].includes(section) ||
        method !== BCH_EVENT_METHODS.deposit
      ) &&
      (![BCH_EVENT_SECTION.parasInclusion, BCH_EVENT_SECTION.inclusion].includes(section) ||
        ![BCH_EVENT_METHODS.candidateBacked, BCH_EVENT_METHODS.candidateIncluded].includes(method))
    }
    /* eslint-enable max-len */

    api.query.system.events(async (records) => {
      commit(vuexTypes.SET_LAST_BLOCK_EVENTS, records)

      const newEvents = records
        .map((record, index) => ({ indexes: [index], record }))
        .filter(({ record: { event: { method, section } } }) =>
          filterEvent(method, section))
        .reduce((combined, e) => {
          const prev = combined.find((
            { record: { event: { method, section } } }) =>
            e.record.event.section === section &&
            e.record.event.method === method,
          )
          prev ? prev.indexes.push(...e.indexes) : combined.push(e)

          return combined
        }, [])
        .reverse()
      const newEventHash = xxhashAsHex(stringToU8a(stringify(newEvents)))
      commit(vuexTypes.SET_EVENT_COUNT, records.length)

      if (newEventHash !== state.pervBlockHash && newEvents.length) {
        commit(vuexTypes.SET_PREV_EVENT_HASH, newEventHash)

        // retrieve the last header, this will map to the current state
        const header = await api.rpc.chain.getHeader(records.createdAtHash)
        const blockNumber = header.number.unwrap()
        const blockHash = header.hash.toHex()

        if (blockHash !== state.pervBlockHash) {
          commit(vuexTypes.SET_PREV_BLOCK_HASH, blockHash)
          commit(vuexTypes.SET_EVENTS, [
            ...newEvents.map(({ indexes, record }) => {
              return new EventWrapperRecord({
                blockHash,
                blockNumber,
                indexes,
                key: `${blockNumber.toNumber()}-${blockHash}-${indexes.join('.')}`,
                record,
              })
            }),
            ...state.events
              .filter((p) => !p.blockNumber?.eq(blockNumber)),
          // remove all events for the previous same-height blockNumber
          ].slice(0, MAX_EVENTS))
        }
      }
    })
  },
}

export const getters = {
  [vuexTypes.events]: state => state.events,
  [vuexTypes.eventCount]: state => state.eventCount,
  [vuexTypes.pervBlockHash]: state => state.pervBlockHash,
  [vuexTypes.pervEventHash]: state => state.pervEventHash,
  [vuexTypes.lastBlockEvents]: state => state.lastBlockEvents,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
