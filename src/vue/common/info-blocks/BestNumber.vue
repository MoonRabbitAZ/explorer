<template>
  <div class="best-number">
    <info-block
      v-if="bestNumber"
      class="best-number__info"
      :value="bestNumber.toNumber()"
      :title="isFinalized
        ? $t('common.best-number.finalized-title')
        : $t('common.best-number.best-title')
      "
    />
    <skeleton-loader
      v-else
      class="best-number__sceleton-loader"
    />
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { api } from '@api'
import { useCall } from '@/vue/composables'

export default {
  name: 'best-number',

  components: {
    InfoBlock,
    SkeletonLoader,
  },

  props: {
    isFinalized: { type: Boolean, default: false },
  },

  setup (props) {
    const bestNumber = useCall(
      props.isFinalized
        ? api.derive.chain.bestNumberFinalized
        : api.derive.chain.bestNumber,
    )

    return {
      bestNumber,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.best-number {
  width: 100%;
}

.best-number__sceleton-loader {
  width: 100%;
  height: $min-height-info-block;
}

</style>
