<template>
  <div class="democracy">
    <page-topbar
      :page-name="$t('routers-groups.governance.routers.democracy')"
      :tabs="democracy"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'democracy',

  components: {
    PageTopbar,
  },

  setup () {
    const { democracy } = usePagesTabs()

    return {
      democracy,
    }
  },
}
</script>
