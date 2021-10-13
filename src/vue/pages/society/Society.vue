<template>
  <div class="society">
    <page-topbar
      :page-name="$t('routers-groups.temples.routers.society')"
      :tabs="society"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'society',

  components: {
    PageTopbar,
  },

  setup () {
    const { society } = usePagesTabs()

    return {
      society,
    }
  },
}
</script>
