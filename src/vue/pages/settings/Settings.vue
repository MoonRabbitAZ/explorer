<template>
  <div class="settings">
    <page-topbar
      :page-name="$t('routers-groups.settings.routers.settings')"
      :tabs="settings"
    />
    <router-view />
  </div>
</template>

<script>
import PageTopbar from '@/vue/common/PageTopbar'
import { usePagesTabs } from '@/vue/composables'

export default {
  name: 'event-calendar',

  components: {
    PageTopbar,
  },

  setup () {
    const { settings } = usePagesTabs()

    return {
      settings,
    }
  },
}
</script>
