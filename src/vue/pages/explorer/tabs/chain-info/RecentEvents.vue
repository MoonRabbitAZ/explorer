<template>
  <div class="recent-events">
    <h2 class="recent-events__title app__big-title">
      {{ $t('title') }}
    </h2>
    <template v-if="events.length">
      <div class="recent-events__events-wrap">
        <div
          v-for="(item, id) in events"
          class="recent-events__event app__content-block"
          :key="id"
        >
          <div class="recent-events__event-header">
            <span class="recent-events__event-title">
              {{ `${item.record.event.section}.${item.record.event.method}` }}
            </span>
            <div class="recent-events__event-block-number">
              <router-link
                class="recent-events__event-block-number-link"
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
      <div class="recent-events__no-data-message app__content-block">
        {{ $t('no-data-message') }}
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { formatNumber } from '@polkadot/util'

export default {
  name: 'recent-events',

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

.recent-events__event-block-number-link {
  color: $col-app-accent;
}

.recent-events__no-data-message {
  height: 5.2rem;
  padding: 0 1.6rem;
  color: $col-app-no-data;
  display: flex;
  align-items: center;
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
