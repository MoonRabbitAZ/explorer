<template>
  <div class="evm-overview-summary">
    <div class="evm-overview-summary__content">
      <!-- eslint-disable max-len -->
      <info-block
        :title="$t('evm-explorer-page.evm-overview-summary.average-block-time-header')"
        :value="result?.chainData.averageBlockTime"
      />
      <info-block
        :title="$t('evm-explorer-page.evm-overview-summary.total-transactions-header')"
        :value="$fnumber(result?.chainData.totalTransactions)"
      />
      <info-block
        :title="$t('evm-explorer-page.evm-overview-summary.total-blocks-header')"
        :value="$fnumber(result?.chainData.totalBlocks)"
      />
      <info-block
        :title="$t('evm-explorer-page.evm-overview-summary.wallet-addresses-header')"
        :value="$fnumber(result?.chainData.addressCount)"
      />
      <!-- eslint-enable max-len -->
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'

import { reactive } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import GET_CHAIN_DATA from '@/graphql/queries/getChainData.gql'

export default {
  name: 'evm-overview-summary',

  components: { InfoBlock },

  props: {
    pollInterval: { type: Number, default: 0 },
  },

  setup (props) {
    const options = reactive({
      ...(props.pollInterval ? { pollInterval: props.pollInterval } : {}),
      fetchPolicy: 'network-only',
    })
    const { result } = useQuery(GET_CHAIN_DATA, {}, options)

    return { result }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-overview-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(4, min-content);
  justify-content: center;

  @include respond-to($tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include respond-to($x-small) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
