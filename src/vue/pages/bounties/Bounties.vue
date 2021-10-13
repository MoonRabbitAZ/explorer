<template>
  <div class="bounties">
    <page-topbar
      :page-name="$t('routers-groups.governance.routers.bounties')"
      :tabs="bounties"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'bounties',

  components: {
    PageTopbar,
  },

  setup () {
    const { bounties } = usePagesTabs()

    return {
      bounties,
    }
  },
}
</script>
