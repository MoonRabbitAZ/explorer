<template>
  <div class="event-item app__content-block">
    <p class="event-item__row event-item__date-wrap">
      <span
        v-if="isFullDate"
        class="event-item__date"
      >
        {{ $fdddmy(event.date) }}
      </span>
      <span class="event-item__time">
        {{ eventTime }}
      </span>
    </p>
    <i18n-t
      class="event-item__row"
      keypath="event-calendar-page.event-item.message"
      tag="p"
    >
      <template #message>
        <span>
          {{ eventTranslation.messageEventTranslation }}
        </span>
      </template>

      <!-- TODO: change to link after added pages -->
      <template #link>
        <span class="event-item__link">
          {{ eventTranslation.linkEventTranslation }}
        </span>
      </template>
    </i18n-t>

    <p class="event-item__row">
      {{ blockNum }}
    </p>
  </div>
</template>

<script>
import { formatNumber, isString } from '@polkadot/util'
import { toRefs, computed } from 'vue'
import { useEventTranslation } from '@event-calendar-page/composables/useEventTranslation'
import moment from 'moment'

export default {
  name: 'event-item',

  props: {
    event: { type: Object, required: true },
    isFullDate: { type: Boolean, default: false },
  },

  setup (props) {
    const { event } = toRefs(props)

    const infoId = computed(() => isString(event.value.info)
      ? event.value.info
      : formatNumber(event.value.info),
    )

    const eventTime = computed(() =>
      moment(event.value.date).format('HH:mm'),
    )

    const blockNum = computed(() =>
      `#${formatNumber(event.value.blockNumber)}`,
    )

    const eventTranslation = computed(() =>
      useEventTranslation(event.value.type, infoId.value),
    )

    return {
      blockNum,
      eventTime,
      eventTranslation,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.event-item {
  width: 100%;
  padding: 1.6rem;
}

.event-item__row {
  & + & {
    margin-top: 0.8rem;
  }
}

.event-item__date-wrap {
  display: flex;
  justify-content: space-between;
}

.event-item__date {
  color: $col-app-accent;
}

.event-item__link {
  color: $col-app-accent;
}

</style>
