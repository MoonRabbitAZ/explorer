<template>
  <info-block
    v-tooltip="$fFullBalance(totalIssuance)"
    class="total-issuance__info"
    :title="$t('common.total-issuance.total-issued-title')"
    :value="$fbalance(totalIssuance)"
  />
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'

import { api } from '@api'
import { useCall } from '@/vue/composables'

export default {
  name: 'total-issuance',

  components: { InfoBlock },

  setup () {
    const totalIssuance = useCall(api.query.balances?.totalIssuance)

    return { totalIssuance }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.total-issuance__info {
  width: 100%;
}
</style>
