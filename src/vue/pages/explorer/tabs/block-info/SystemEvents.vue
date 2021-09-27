<template>
  <div class="system-events">
    <h1 class="system-events__title app__big-title">
      {{ $t('explorer-page.system-events.title') }}
    </h1>
    <template v-if="systemEvents.length">
      <div
        class="system-events__event-wrap  app__content-block"
        v-for="({event}, id) in systemEvents"
        :key="id"
      >
        <event-display
          :event="event"
        />
      </div>
    </template>
    <template v-else>
      <no-data-message
        is-secondary
        :message="$t('explorer-page.system-events.no-data-message')"
      />
    </template>
  </div>
</template>

<script>
import EventDisplay from '@/vue/common/EventDisplay'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { computed } from 'vue'

export default {
  name: 'system-events',

  components: { EventDisplay, NoDataMessage },

  props: {
    events: { type: Array, required: true },
  },

  setup (props) {
    const systemEvents = computed(() =>
      props.events.filter(({ phase }) => !phase.isApplyExtrinsic),
    )

    return {
      systemEvents,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.system-events__event-wrap {
  padding: 1.8rem 1.6rem;

  & + & {
    margin-top: 0.4rem;
  }
}

.system-events__title {
  margin-bottom: 2rem;
}
</style>
