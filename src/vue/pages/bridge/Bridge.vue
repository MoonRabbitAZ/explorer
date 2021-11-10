<template>
  <div class="bridge">
    <page-topbar
      :page-name="$t('routers-groups.accounts.routers.bridge')"
      :tabs="bridge"
    />
    <template v-if="!isMetamaskConnected">
      <div class="bridge__wrap">
        <div class="bridge__metamask-wrap">
          <metamask-form class="bridge__metamask-form"/>
        </div>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import MetamaskForm from '@/vue/common/MetamaskForm'
import { usePagesTabs, useWeb3 } from '@/vue/composables'

export default {
  name: 'bridge',

  components: {
    PageTopbar,
    MetamaskForm,
  },

  setup () {
    const { bridge } = usePagesTabs()

    const { isMetamaskConnected } = useWeb3()

    return { bridge, isMetamaskConnected }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bridge__wrap { @include app-padding; }

.bridge__metamask-wrap {
  background: $col-app-content-block-bg;
  border-radius: 2rem;
  max-width: 37.3rem;
  padding: 4rem 0;
  margin: 0 auto;
}

.bridge__metamask-form {
  max-width: 27rem;
  margin: 0 auto;
}
</style>
