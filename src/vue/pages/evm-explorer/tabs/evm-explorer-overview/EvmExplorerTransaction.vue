<template>
  <div class="evm-explorer-transaction">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else>
      <div class="evm-explorer-transaction__info">
        <!-- eslint-disable  max-len-->
        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.transaction-hash-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.transaction-hash-info')"
          :value="result.transaction.hash"
          with-clipboard
        />
        <!-- eslint-enable  max-len-->
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

import GET_TRANSACTION from '@/graphql/queries/getTransaction.gql'

export default {
  name: 'evm-explorer-transaction',

  components: { InfoValue, Loader },

  props: {
    hash: { type: String, required: true },
  },

  setup (props) {
    const { result, variables, loading } =
      useQuery(GET_TRANSACTION, { hash: props.hash })

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

.evm-explorer-transaction__info {
  @include content-block;
  padding: 1.8rem;
}

.evm-explorer-transaction__hash {
  margin-bottom: 4rem;
}

.evm-explorer-transaction__info-row {
  & + & {
    margin-top: 2.4rem;
  }
}

</style>
