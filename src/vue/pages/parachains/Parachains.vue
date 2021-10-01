<template>
  <div class="parachains">
    <page-topbar
      :page-name="$t('routers-groups.temples.routers.parachains')"
      :tabs="parachains"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'explorer',

  components: {
    PageTopbar,
  },

  setup () {
    const { parachains } = usePagesTabs()

    return {
      parachains,
    }
  },
}
</script>
