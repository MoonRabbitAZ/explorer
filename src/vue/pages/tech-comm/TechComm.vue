<template>
  <div class="tech-comm">
    <page-topbar
      :page-name="$t('routers-groups.governance.routers.tech-comm')"
      :tabs="techComm"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'tech-comm',

  components: {
    PageTopbar,
  },

  setup () {
    const { techComm } = usePagesTabs()

    return { techComm }
  },
}
</script>
