<template>
  <div class="bridge">
    <page-topbar
      :page-name="$t('routers-groups.accounts.routers.bridge')"
      :tabs="bridge"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'bridge',

  components: {
    PageTopbar,
  },

  setup () {
    const { bridge } = usePagesTabs()

    return {
      bridge,
    }
  },
}
</script>
