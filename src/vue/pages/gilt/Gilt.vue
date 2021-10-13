<template>
  <div class="gilt">
    <page-topbar
      :page-name="$t('routers-groups.temples.routers.gilt')"
      :tabs="gilt"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'gilt',

  components: {
    PageTopbar,
  },

  setup () {
    const { gilt } = usePagesTabs()

    return {
      gilt,
    }
  },
}
</script>
