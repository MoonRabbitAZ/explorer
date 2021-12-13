<template>
  <div class="dispatch-entry-row">
    <p class="dispatch-entry-row__index">
      {{ $fnumber(entry.index) }}
    </p>
    <div>
      <proposal-cell
        class="dispatch-entry-row__proposals"
        :image-hash="entry.imageHash"
        :proposal="entry.image?.proposal"
      />
    </div>
    <div>
      <template v-if="atTime">
        <p class="dispatch-entry-row__time">
          {{ atTime }}
        </p>
        <p>
          {{ `#${$fnumber(entry.at)}` }}
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import ProposalCell from '@council-page/tabs/motions/ProposalCell'

import { computed } from 'vue'
import { useBlockTime, useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'dispatch-entry-row',

  components: { ProposalCell },

  props: {
    entry: { type: Object, required: true },
  },

  setup (props) {
    const { calculateTimeStr } = useBlockTime()
    const bestNumber = useCall(api.derive.chain.bestNumber)

    const atTime = computed(() => {
      if (!bestNumber.value || !props.entry?.at) return null
      return calculateTimeStr(props.entry.at.sub(bestNumber.value), true)
    })

    return { atTime }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.dispatch-entry-row__index {
  font-size: 1.6rem;
}

.dispatch-entry-row {
  @include democracy-dispatch-grid-row(center, 1rem);
  @include content-block;
}

.dispatch-entry-row__time {
  margin-bottom: 1rem;
}
</style>
