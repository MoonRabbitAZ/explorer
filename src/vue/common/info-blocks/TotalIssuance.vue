<template>
  <div class="total-issuance">
    <info-block
      v-if="currentBalance"
      v-tooltip="$fFullBalance(currentBalance)"
      class="total-issuance__info"
      :title="$t('common.total-issuance.total-issued-title')"
      :value="$fbalance(currentBalance)"
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

import { computed } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { IS_MAIN_NODE, DEDUCTIBLE_BALANCE } from '@/js/const/deducticable-balance.const'

export default {
  name: 'total-issuance',

  components: {
    InfoBlock,
    SkeletonLoader,
  },

  setup () {
    const totalIssuance = useCall(api.query.balances?.totalIssuance)
    const currentBalance = computed(() => {
      if (!totalIssuance.value) return
      return IS_MAIN_NODE && totalIssuance.value.gt(DEDUCTIBLE_BALANCE)
        ? totalIssuance.value.sub(DEDUCTIBLE_BALANCE)
        : totalIssuance.value
    })
    return {
      currentBalance,
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
