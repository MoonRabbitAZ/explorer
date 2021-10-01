<template>
  <div class="epoch-time">
    <info-block
      v-if="epochTime.total && epochTime.progress"
      class="epoch-time__info"
      :title="$t('common.epoch-time.epoch-title')"
      :value="epochTime.total"
      :secondary-value="epochTime.progress"
    />
    <skeleton-loader
      v-else
      class="epoch-time__sceleton-loader"
    />
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { api } from '@api'
import { useCall, useBlockTime } from '@/vue/composables'
import { computed } from 'vue'

export default {
  name: 'epoch-time',

  components: {
    InfoBlock,
    SkeletonLoader,
  },

  setup () {
    const sessionInfo = useCall(api.derive.session?.progress)
    const { calculateTimeStr } = useBlockTime()

    const epochTime = computed(() => {
      if (sessionInfo.value) {
        const progresValue =
          sessionInfo.value.sessionProgress.sub(sessionInfo.value.sessionLength)

        return {
          total: calculateTimeStr(sessionInfo.value.sessionLength),
          progress: calculateTimeStr(progresValue),
        }
      } else {
        return {
          total: '',
          progress: '',
        }
      }
    })

    return {
      epochTime,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.epoch-time__info {
  width: 100%;
  min-width: 4.7rem;
}

.epoch-time__sceleton-loader {
  width: 100%;
  height: $min-height-info-block;
}
</style>
