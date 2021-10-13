<template>
  <div class="treasury">
    <page-topbar
      :page-name="$t('routers-groups.governance.routers.treasury')"
      :tabs="treasury"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'treasury',

  components: {
    PageTopbar,
  },

  setup () {
    const { treasury } = usePagesTabs()

    return {
      treasury,
    }
  },
}
</script>
