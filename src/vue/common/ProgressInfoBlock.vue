<template>
  <info-block
    :title="title"
    :value="info.total"
    :secondary-value="info.progress"
  >
    <template #additional>
      <progress-bar
        :current="current"
        :total="total"
      />
    </template>
  </info-block>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressBar from '@/vue/common/ProgressBar'

import { computed } from 'vue'
import { useBlockTime, useFormatBalance } from '@/vue/composables'
import { BN } from '@polkadot/util'

export default {
  name: 'progress-info-block',

  components: { InfoBlock, ProgressBar },

  props: {
    title: { type: String, required: true },
    total: { type: BN, default: null },
    current: { type: BN, default: null },
    withBalance: { type: Boolean, default: false },
  },

  setup (props) {
    const { calculateTimeStr } = useBlockTime()
    const { toBalance } = useFormatBalance()

    const time = computed(() => {
      if (props.current && props.total) {
        const progressValue = props.total.sub(props.current)

        return {
          total: calculateTimeStr(props.total, true),
          progress: calculateTimeStr(progressValue, true),
        }
      } else {
        return {
          total: null,
          progress: null,
        }
      }
    })

    const info = computed(() => {
      return props.withBalance
        ? {
            total: toBalance(props.total),
            progress: toBalance(props.current),
          }
        : time.value
    })

    return { info }
  },
}
</script>
