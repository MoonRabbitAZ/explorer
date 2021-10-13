<template>
  <div class="council">
    <page-topbar
      :page-name="$t('routers-groups.governance.routers.council')"
      :tabs="council"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'council',

  components: {
    PageTopbar,
  },

  setup () {
    const { council } = usePagesTabs()

    return {
      council,
    }
  },
}
</script>
