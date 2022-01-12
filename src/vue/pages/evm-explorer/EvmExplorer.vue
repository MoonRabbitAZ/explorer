<template>
  <div class="evm-explorer">
    <page-topbar
      :page-name="$t('routers-groups.evm-explorer.routers.evm-explorer')"
      :tabs="evmExplorer"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'evm-explorer',

  components: {
    PageTopbar,
  },

  setup () {
    const { evmExplorer } = usePagesTabs()

    return {
      evmExplorer,
    }
  },
}
</script>
