<template>
  <div class="explorer">
    <page-topbar
      :page-name="$t('routers-groups.temples.routers.explorer')"
      :tabs="explorer"
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
    const { explorer } = usePagesTabs()

    return {
      explorer,
    }
  },
}
</script>
