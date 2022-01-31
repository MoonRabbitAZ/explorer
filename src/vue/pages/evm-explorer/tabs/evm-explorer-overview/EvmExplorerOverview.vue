<template>
  <div class="evm-explorer-overview">
    <evm-block-list
      class="evm-explorer-overview__list"
      :poll-interval="POOL_INTERVAL"
      :time-now="timeNow"
      :no-data-message="
        $t('evm-explorer-page.evm-explorer-overview.no-data-message-blocks')
      "
    />
    <!-- eslint-disable max-len -->
    <evm-transactions-list
      class="evm-explorer-overview__list"
      :no-data-message="$t('evm-explorer-page.evm-explorer-address.no-data-message-transactions')"
      :poll-interval="POOL_INTERVAL"
      :time-now="timeNow"
      :with-pagination="false"
    />
    <!-- eslint-disable max-len -->
  </div>
</template>

<script>
import EvmBlockList from '@evm-explorer-page/tabs/evm-explorer-overview/EvmBlockList'
import EvmTransactionsList from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTransactionsList'

import { useTimeNow } from '@/vue/composables'

const POOL_INTERVAL = 10000
export default {
  name: 'evm-explorer-overview',

  components: { EvmBlockList, EvmTransactionsList },

  setup () {
    const timeNow = useTimeNow()

    return { timeNow, POOL_INTERVAL }
  },
}
</script>

<style lang="scss" scoped>
.evm-explorer-overview__list {
  & + & {
    margin-top: 3rem;
  }
}
</style>
