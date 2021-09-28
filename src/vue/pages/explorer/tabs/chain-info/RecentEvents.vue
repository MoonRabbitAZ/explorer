<template>
  <div class="recent-events">
    <h1 class="recent-events__title">
      {{ $t('title') }}
    </h1>
    <template v-if="events.length">
      <div class="recent-events__events-wrap">
        <div
          v-for="(item, id) in events"
          class="recent-events__event"
          :key="id"
        >
          <div class="recent-events__event-header">
            <span class="recent-events__event-title">
              {{ `${item.record.event.section}.${item.record.event.method}` }}
            </span>
            <div class="recent-events__event-block-number">
              <router-link
                :to="{
                  ...$routes.blockInfoTab,
                  query: {
                    blockIdent: item.blockHash,
                  }
                }"
              >
                {{ eventBlockNumber(item) }}
              </router-link>
            </div>
          </div>
          <div class="recent-events__event-meta">
            {{ formatMeta(item.record.event.meta) }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <no-data-message
        is-row-block
        :message="$t('no-data-message')"
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { formatNumber } from '@polkadot/util'

export default {
  name: 'recent-events',

  components: { NoDataMessage },

  setup () {
    const store = useStore()
    const events = computed(() => store.getters[vuexTypes.events])

    function formatMeta (meta) {
      if (!meta || !meta.documentation.length) {
        return null
      }

      const strings = meta.documentation.map((doc) => doc.toString().trim())
      const firstEmpty = strings.findIndex((doc) => !doc.length)
      const combined = (
        firstEmpty === -1
          ? strings
          : strings.slice(0, firstEmpty)
      ).join(' ').replace(/#(<weight>| <weight>).*<\/weight>/, '')
      const parts = combined.replace(/\\/g, '').replace(/`/g, '')

      return parts
    }

    function eventBlockNumber (event) {
      return `${formatNumber(event.blockNumber)}-${event.indexes[0]}`
    }

    return {
      formatMeta,
      events,
      eventBlockNumber,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

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

.recent-events__event-header {
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 1rem;
  margin-bottom: 1rem;
}

.recent-events__event-title,
.recent-events__event-block-number {
  flex: 1;
  color: $col-app-accent;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<i18n>
{
  "en": {
    "title": "Recent events",
    "no-data-message": "No events available",
  }
}
</i18n>
