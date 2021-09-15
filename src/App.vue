<template>
  <div class="app__main">
    <div
      class="app__background"
      :class="{'app__background--loaded': isApiConnected && isAppInitialised}"
    />
    <template v-if="isApiConnected && isAppInitialised">
      <router-view />
    </template>
    <div
      v-else
      class="app__main-loader-wrap"
    >
      <img
        class="app__loader-init-logo"
        src="@static/branding/init-logo.png"
        :alt="$t('init-logo')"
      >
      <loader class="app__main-loader"/>
    </div>
    <status-message />
  </div>
</template>

<script>
import StatusMessage from '@/vue/common/StatusMessage'
import Loader from '@/vue/common/Loader'

import { api } from '@api'
import { loadOnReady } from '@/js/helpers/api-helper'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'app',

  components: { StatusMessage, Loader },

  setup () {
    const store = useStore()
    const isAppInitialised = ref(false)
    const isApiConnected = ref(false)
    const blockAuthorHandler = async (header) =>
      await store.dispatch(vuexTypes.BLOCK_AUTHORS_HANDLER, header)
    api.on('connected', () => { isApiConnected.value = true })
    api.on('disconnected', () => { isApiConnected.value = false })
    api.on('error', (error) => ErrorHandler.process(error))
    api.on('ready', async () => {
      try {
        const state = await loadOnReady(api)
        store.dispatch(vuexTypes.SET_APP_STATE, state)
        api.derive.chain.subscribeNewHeads(blockAuthorHandler)
        store.dispatch(vuexTypes.SUBSCRIBE_ERA_POINTS)
        store.dispatch(vuexTypes.SUBSCRIBE_EVENTS)

        isAppInitialised.value = true
      } catch (e) {
        ErrorHandler.process(e)
      }
    })

    return { isAppInitialised, isApiConnected, store }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.app__background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: url('~@static/branding/app-content-bg.png')
    no-repeat center center;
  background-size: cover;
  filter: none;
  z-index: $z-app-background;

  &--loaded {
    filter: blur(0.6rem);
  }
}

.app__main-loader-wrap {
  position: fixed;
  top: 2%;
  left: 50%;
  transform: translateX(-50%);
  z-index: $z-app-init-logo;
}

.app__loader-init-logo {
  width: 30rem;
  height: 31.4rem;
}
</style>

<i18n>
{
  "en": {
    "init-logo": "Moon rabbit",
  }
}
</i18n>
