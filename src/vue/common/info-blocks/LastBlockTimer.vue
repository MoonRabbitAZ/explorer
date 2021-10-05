<template>
  <div class="last-block-timer">
    <info-block
      v-if="blockTime.type"
      class="last-block-timer__info"
      :title="$t('common.last-block-timer.last-block-title')"
      :value="`${blockTime.before}.${blockTime.post} ${blockTime.type}`"
    />
    <skeleton-loader
      v-else
      class="last-block-timer__sceleton-loader"
    />
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { useBlockTimer } from '@explorer-page/composables/useBlockTimer'

export default {
  name: 'last-block-timer',

  components: {
    InfoBlock,
    SkeletonLoader,
  },

  setup () {
    const blockTime = useBlockTimer()

    return {
      blockTime,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.last-block-timer__info {
  width: 100%;
}

.last-block-timer__sceleton-loader {
  width: 100%;
  height: $min-height-info-block;
}
</style>
