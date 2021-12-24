<template>
  <div class="referendum-row">
    <p class="referendum-row__index">
      {{ $fnumber(referendum.index) }}
    </p>
    <div>
      <proposal-cell
        class="referendum-row__proposals"
        :image-hash="referendum.imageHash"
        :proposal="referendum.image?.proposal"
      />
    </div>
    <div>
      <template v-if="remainTime">
        <p class="referendum-row__time">
          {{ remainTime }}
        </p>
        <p>
          {{ `#${$fnumber(remainBlock)}` }}
        </p>
      </template>
    </div>
    <div>
      <template v-if="enactTime">
        <p class="referendum-row__time">
          {{ enactTime }}
        </p>
        <p>
          {{ `#${$fnumber(enactBlock)}` }}
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
import { BN_ONE } from '@polkadot/util'

export default {
  name: 'referendum-row',

  components: { ProposalCell },

  props: {
    referendum: { type: Object, required: true },
  },

  setup (props) {
    const { calculateTimeStr } = useBlockTime()
    const bestNumber = useCall(api.derive.chain.bestNumber)

    const enactBlock = computed(() =>
      props.referendum?.status.end.add(props.referendum.status.delay),
    )

    const remainBlock = computed(() => {
      if (!bestNumber.value || !props.referendum?.status) return null
      return props.referendum.status.end.sub(bestNumber.value).isub(BN_ONE)
    })

    const remainTime = computed(() => {
      if (!remainBlock.value) return null
      return calculateTimeStr(remainBlock.value, true)
    })

    const enactTime = computed(() => {
      if (!bestNumber.value || !enactBlock.value) return null
      return calculateTimeStr(enactBlock.value.sub(bestNumber.value), true)
    })

    return {
      remainTime,
      remainBlock,
      enactBlock,
      enactTime,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.referendum-row {
  min-width: min-content;

  @include democracy-dispatch-grid-row(center, 1rem);
  @include content-block;
}

.referendum-row__index {
  font-size: 1.6rem;
}

.referendum-row__time {
  margin-bottom: 1rem;
}
</style>
