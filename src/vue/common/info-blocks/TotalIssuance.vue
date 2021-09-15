<template>
  <div class="total-issuance">
    <info-block
      v-if="totalIssuance"
      class="total-issuance__info"
      :title="$t('total-issued-title')"
      :value="$fbalance(totalIssuance)"
    />
    <skeleton-loader
      v-else
      class="total-issuance__sceleton-loader"
    />
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { api } from '@api'
import { useCall } from '@/vue/composables'
export default {
  name: 'chain-info-blocks',

  components: {
    InfoBlock,
    SkeletonLoader,
  },

  setup () {
    const totalIssuance = useCall(api.query.balances?.totalIssuance)

    return {
      totalIssuance,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.total-issuance__info {
  width: 100%;
}

.total-issuance__sceleton-loader {
  width: 100%;
  height: $min-height-info-block;
}

</style>

<i18n>
{
  "en": {
    "total-issued-title": "Total issued",
  }
}
</i18n>
