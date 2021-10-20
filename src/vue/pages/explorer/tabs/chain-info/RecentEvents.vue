<template>
  <div class="recent-events">
    <h1 class="recent-events__title">
      {{ $t('explorer-page.recent-events.title') }}
    </h1>
    <template v-if="events.length">
      <div class="recent-events__events-wrap">
        <recent-event
          v-for="event in events"
          class="recent-events__event"
          :key="event.key"
          :event="event"
        />
      </div>
    </template>
    <template v-else>
      <no-data-message
        is-row-block
        :message="$t('explorer-page.recent-events.no-data-message')"
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import RecentEvent from '@explorer-page/tabs/chain-info/RecentEvent'

import { computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'recent-events',

  components: { NoDataMessage, RecentEvent },

  setup () {
    const store = useStore()
    const events = computed(() => store.getters[vuexTypes.events])

    return {
      events,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.recent-events {
  overflow: hidden;
}

.recent-events__title {
  margin-bottom: 2rem;
}

.recent-events__events-wrap {
  max-height: 50vh;
  overflow-y: auto;

  @include scrollbar;
}

.recent-events__event {
  padding: 1.6rem;

  @include content-block;

  & + & {
    margin-top: 0.4rem;
  }
}
</style>
