<template>
  <div class="evm-explorer-address">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else>
      <div class="evm-explorer-address__info">
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
    </template>
  </div>
</template>

<script>
import InfoValue from '@evm-explorer-page/tabs/evm-explorer-overview/InfoValue'
import Loader from '@/vue/common/Loader'
import CONFIG from '@/config'

import { watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import GET_ADDRESS from '@/graphql/queries/getAddress.gql'

export default {
  name: 'evm-explorer-address',

  components: { InfoValue, Loader },

  props: {
    hash: { type: String, required: true },
  },

  setup (props) {
    const { result, variables, loading } =
      useQuery(GET_ADDRESS, { hash: props.hash })

    function selectHash () {
      variables.value = {
        hash: props.hash,
      }
    }

    watch(() => props.hash, selectHash)

    return {
      result,
      loading,
      CONFIG,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-explorer-address__info {
  @include content-block;
  padding: 1.8rem;
}

.evm-explorer-address__hash {
  margin-bottom: 4rem;
}

.evm-explorer-address__info-row {
  & + & {
    margin-top: 2.4rem;
  }
}

</style>
