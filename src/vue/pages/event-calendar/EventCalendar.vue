<template>
  <div class="event-calendar">
    <page-topbar
      :page-name="$t('routers-groups.temples.routers.event-calendar')"
      :tabs="calendarEvents"
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
    const { calendarEvents } = usePagesTabs()

    return {
      calendarEvents,
    }
  },
}
</script>
