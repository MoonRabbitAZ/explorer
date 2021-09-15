<template>
  <footer class="app-footer app__padding">
    <p class="app-footer__all-rights">
      {{ $t("all-rights") }}
    </p>
    <div class="app-footer__versions-wrap">
      <p class="app-footer__version">
        {{ systemInfo }}
      </p>
      <p class="app-footer__version">
        {{ apiVersion }}
      </p>
      <p class="app-footer__version">
        {{ appVersion }}
      </p>
    </div>
  </footer>
</template>

<script>
import { api } from '@api'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { CONFIG } from '@/config'

export default {
  name: 'app-footer',

  setup () {
    const store = useStore()
    const apiVersion = ref(api.libraryInfo.replace('@polkadot/', ''))
    const appVersion = ref(`apps v${CONFIG.BUILD_VERSION}`)
    const systemInfo = computed(() =>
      store.getters[vuexTypes.systemChain] + ' ' +
        store.getters[vuexTypes.systemVersion].split('-')[0],
    )

    return {
      appVersion,
      systemInfo,
      apiVersion,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.app-footer {
  background: $col-app-block-bg;
  padding-bottom: 1rem;
  padding-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include respond-to($tablet) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.app-footer__versions-wrap {
  min-width: 10rem;
  text-align: right;
  margin-left: 2rem;

  @include respond-to($tablet) {
    margin-left: 0;
    text-align: left;
    margin-top: 2.4rem;
  }
}

.app-footer__version {
  font-size: 1rem;
  line-height: 1.2rem;
}
</style>

<i18n>
{
  "en": {
    "all-rights": "Moon Rabbit AngoZaibatsu LLC © 2021. All Rights Reserved. This is not an investment solicitation or offering. USofA citizens, residents and legal entities are fully excluded. Versetti&Co Family Organisation",
  }
}
</i18n>
