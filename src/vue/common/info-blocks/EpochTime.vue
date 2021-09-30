<template>
  <div class="epoch-time">
    <template v-if="sessionInfo">
      <info-block
        class="epoch-time__info"
        :title="$t('epoch-title')"
        :value="epochTime.total"
        :secondary-value="epochTime.progress"
      >
        <template #additional>
          <progress-bar
            :current="sessionInfo.sessionProgress"
            :total="sessionInfo.sessionLength"
          />
        </template>
      </info-block>
    </template>
    <skeleton-loader
      v-else
      class="epoch-time__sceleton-loader"
    />
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressBar from '@/vue/common/ProgressBar'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { api } from '@api'
import { useCall, useBlockTime } from '@/vue/composables'
import { computed } from 'vue'

export default {
  name: 'epoch-time',

  components: {
    InfoBlock,
    SkeletonLoader,
    ProgressBar,
  },

  setup () {
    const sessionInfo = useCall(api.derive.session?.progress)

    const epochTime = computed(() => {
      if (sessionInfo.value) {
        const progresValue =
          sessionInfo.value.sessionProgress.sub(sessionInfo.value.sessionLength)
        const { timeStr: total } =
          useBlockTime(sessionInfo.value.sessionLength)
        const { timeStr: progress } = useBlockTime(progresValue)

        return {
          total: total.value,
          progress: progress.value,
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
      sessionInfo,
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

<i18n>
{
  "en": {
    "epoch-title": "Epoch",
  }
}
</i18n>
