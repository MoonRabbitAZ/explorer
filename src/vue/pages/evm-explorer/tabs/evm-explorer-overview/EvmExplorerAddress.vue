<template>
  <div class="evm-explorer-address">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else-if="error">
      <error-message :message="error.message" />
    </template>
    <template v-else>
      <!-- eslint-disable  max-len-->
      <div class="evm-explorer-address__info">
        <h1>
          {{ $t('evm-explorer-page.evm-explorer-address.address-details-header') }}
        </h1>
        <div class="evm-explorer-address__info-block">
          <h3 class="evm-explorer-address__hash">
            {{ result.address.hash }}
          </h3>
          <info-value
            class="evm-explorer-address__info-row"
            :header="$t('evm-explorer-page.evm-explorer-address.balance-header')"
            :info-tooltip="
              $t('evm-explorer-page.evm-explorer-address.balance-info')
            "
            :value="$fFullBalance(
              result.address.fetchedCoinBalance,
              CONFIG.EVM_TOKEN_DECIMAL,
              CONFIG.EVM_TOKEN_TICKER
            )"
          />
        </div>
      </div>

      <evm-transactions-list
        :transactions="transactions"
        :current-address="result.address.hash"
        :no-data-message="$t('evm-explorer-page.evm-explorer-address.no-data-message-transactions')"
      />
      <!-- eslint-enable  max-len-->
    </template>
  </div>
</template>

<script>
import InfoValue from '@evm-explorer-page/tabs/evm-explorer-overview/InfoValue'
import EvmTransactionsList from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTransactionsList'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { reactive, computed, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import CONFIG from '@/config'
import GET_ADDRESS from '@/graphql/queries/getAddress.gql'

export default {
  name: 'evm-explorer-address',

  components: { InfoValue, Loader, ErrorMessage, EvmTransactionsList },

  props: {
    hash: { type: String, required: true },
  },

  setup (props) {
    const accountVariables = reactive({
      hash: props.hash,
      transactionFirst: 8,
    })

    const { result, loading, error } =
      useQuery(GET_ADDRESS, accountVariables)

    function selectHash () {
      accountVariables.hash = props.hash
    }

    const transactions = computed(() =>
      result.value?.address?.transactions?.edges,
    )

    watch(() => props.hash, selectHash)

    return {
      result,
      loading,
      error,
      transactions,
      CONFIG,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-explorer-address__info-block {
  padding: 1.8rem;
  margin-top: 2rem;

  @include content-block;
}

.evm-explorer-address__hash {
  margin-bottom: 4rem;
}

.evm-explorer-address__info-row {
  & + & {
    margin-top: 2.4rem;
  }
}

.evm-explorer-address__info {
  margin-bottom: 4rem;
}

</style>
