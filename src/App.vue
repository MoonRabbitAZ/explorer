<template>
  <div class="app__main">
    <div
      class="app__background"
      :class="{
        'app__background--loaded': isLoaded,
        'app__background--blurred': isBlurredBg
      }"
    />
    <template v-if="isLoaded">
      <router-view />
    </template>
    <div
      v-else
      class="app__main-loader-wrap"
    >
      <img
        class="app__loader-init-logo"
        src="@static/branding/init-logo.png"
        :alt="CONFIG.APP_NAME"
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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { useRoute } from 'vue-router'
import { vueRoutes } from '@/vue-router'
import CONFIG from '@/config'

export default {
  name: 'app',

  components: { StatusMessage, Loader },

  setup () {
    document.title = CONFIG.APP_NAME
    const store = useStore()
    const route = useRoute()
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

    const isLoaded = computed(() =>
      isAppInitialised.value && isApiConnected.value,
    )

    const isBlurredBg = computed(() =>
      route.name === vueRoutes.validatorsMapPage.name && isLoaded.value,
    )

    return {
      isAppInitialised,
      isApiConnected,
      isBlurredBg,
      isLoaded,
      CONFIG,
    }
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
  background-image: url('~@static/branding/app-content-bg.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: none;
  z-index: $z-app-background;

  &--loaded {
    background-image:
      linear-gradient(rgba($col-app-bg, 0.1), rgba($col-app-bg, 0.1)),
      url('~@static/branding/app-content-bg.png');
    filter: blur(0.6rem);
  }

  &--blurred {
    background-image:
      linear-gradient(rgba($col-app-bg, 0.6), rgba($col-app-bg, 0.6)),
      url('~@static/branding/app-content-bg.png');
    filter: blur(2.5rem);
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
