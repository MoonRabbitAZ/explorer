import { createStore } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { sessionStoragePlugin } from '@/vuex/plugins/session-storage'
import appModule from '@/vuex/app.module'
import blockAuthorsModule from '@/vuex/block-authors.module'
import eventsModule from '@/vuex/events.module'

export const rootModule = {
  mutations: {
    [vuexTypes.POP_STATE] () {},
    [vuexTypes.CLEAR_STATE] () {},
  },
  actions: {
  },
  getters: {
  },
}

export const store = createStore({
  ...rootModule,
  modules: {
    appModule,
    blockAuthorsModule,
    eventsModule,
  },
  plugins: [sessionStoragePlugin],
})

export { vuexTypes } from './types'
