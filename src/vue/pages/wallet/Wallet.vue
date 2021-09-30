<template>
  <div class="wallet">
    <page-topbar
      :page-name="$t('routers-groups.accounts.routers.wallet')"
      :tabs="wallet"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'wallet',

  components: {
    PageTopbar,
  },

  setup () {
    const { wallet } = usePagesTabs()

    return {
      wallet,
    }
  },
}
</script>
