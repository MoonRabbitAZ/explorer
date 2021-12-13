<template>
  <div class="schedule-row">
    <div>
      <call-expander
        :extrinsic="entry.call"
        :is-full-width-header="false"
      />
    </div>
    <p class="schedule-row__column">
      {{ name }}
    </p>
    <div>
      <template v-if="remainingTime">
        <p class="schedule-row__time">
          {{ remainingTime }}
        </p>
        <p>
          {{ `#${$fnumber(entry.blockNumber)}` }}
        </p>
      </template>
    </div>
    <p>
      <template v-if="period">
        {{ $fnumber(period[0]) }}
      </template>
    </p>
    <p>
      <template v-if="period">
        {{ $fnumber(period[1]) }}
      </template>
    </p>
  </div>
</template>

<script>
import CallExpander from '@/vue/common/CallExpander'

import { computed } from 'vue'
import { useBlockTime, useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'schedule-row',

  components: { CallExpander },

  props: {
    entry: { type: Object, required: true },
  },

  setup (props) {
    const { calculateTimeStr } = useBlockTime()
    const bestNumber = useCall(api.derive.chain.bestNumber)

    const remainingTime = computed(() => {
      if (!bestNumber.value || !props.entry?.blockNumber) return null
      return calculateTimeStr(
        props.entry.blockNumber.sub(bestNumber.value), true)
    })

    const period = computed(() => props.entry.maybePeriodic.unwrapOr(null))
    const name = computed(() => {
      const name = props.entry.maybeId.unwrapOr(null)

      if (!name) return ''

      return name.isAscii ? name.toUtf8() : name.toHex()
    })

    return { remainingTime, period, name }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.schedule-row {
  min-width: min-content;

  @include democracy-schedule-grid-row(center, 1rem);
  @include content-block;
}

.schedule-row__index {
  font-size: 1.6rem;
}

.schedule-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}

.schedule-row__time {
  margin-bottom: 1rem;
}
</style>
