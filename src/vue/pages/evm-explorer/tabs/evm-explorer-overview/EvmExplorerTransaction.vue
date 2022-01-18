<template>
  <div class="evm-explorer-transaction">
    {{ percentGasUsed }}
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else-if="error">
      <error-message
        :message="error.message"
      />
    </template>
    <template v-else>
      <!-- eslint-disable  max-len-->
      <div class="evm-explorer-transaction__info">
        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.transaction-hash-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.transaction-hash-info')"
          :value="result.transaction.hash"
          with-clipboard
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.result-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.result-info')"
        >
          <transaction-status
            :status="result.transaction.status"
          />
        </info-value>

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.block-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.block-info')"
          :value="result.transaction.blockNumber"
          :route-to="{
            ...$routes.evmExplorerBlock,
            params: {
              blockNumber: result.transaction.blockNumber,
            },
          }"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.timestamp-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.timestamp-info')"
          :value="$fddmyt(result.transaction.timestamp)"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.from-address-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.from-address-info')"
          :value="result.transaction.fromAddressHash"
          :route-to="{
            ...$routes.evmExplorerAddress,
            params: {
              hash: result.transaction.fromAddressHash,
            },
          }"
          with-clipboard
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.to-address-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.to-address-info')"
          :value="result.transaction.toAddressHash"
          :route-to="{
            ...$routes.evmExplorerAddress,
            params: {
              hash: result.transaction.toAddressHash,
            },
          }"
          with-clipboard
        />
      </div>
      <div class="evm-explorer-transaction__info">
        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.value-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.value-info')"
          :value="$fFullBalance(
            result.transaction.value,
            CONFIG.EVM_TOKEN_DECIMAL,
            CONFIG.EVM_TOKEN_TICKER
          )"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.total-fee-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.total-fee-info')"
          :value="$fFullBalance(
            result.transaction.cumulativeGasUsed,
            CONFIG.EVM_TOKEN_DECIMAL,
            CONFIG.EVM_TOKEN_TICKER
          )"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.gas-price-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.gas-price-info')"
          :value="result.transaction.gasPrice"
        />
      </div>

      <div class="evm-explorer-transaction__info">
        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.gas-limit-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.gas-limit-info')"
          :value="$fnumber(result.transaction.gas)"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.gas-used-by-transaction-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.gas-used-by-transaction-info')"
          :value="percentGasUsed"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.nonce-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.nonce-info')"
          :value="result.transaction.nonce"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.raw-input-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.raw-input-info')"
          :value="result.transaction.input"
          with-clipboard
        />
      </div>
      <!-- eslint-enable  max-len-->
    </template>
  </div>
</template>

<script>
import InfoValue from '@evm-explorer-page/tabs/evm-explorer-overview/InfoValue'
import TransactionStatus from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionStatus'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { watch, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { BN } from '@polkadot/util'

import CONFIG from '@/config'
import GET_TRANSACTION from '@/graphql/queries/getTransaction.gql'

export default {
  name: 'evm-explorer-transaction',

  components: { InfoValue, TransactionStatus, Loader, ErrorMessage },

  props: {
    hash: { type: String, required: true },
  },

  setup (props) {
    const { result, variables, loading, error } =
      useQuery(GET_TRANSACTION, { hash: props.hash })

    function selectHash () {
      variables.value = {
        hash: props.hash,
      }
    }

    const percentGasUsed = computed(() => {
      if (loading.value) return
      const gas = result.value.transaction.gas
      const percent = new BN(result.value.transaction.gasUsed)
        .muln(10000)
        .div(new BN(gas))
        .toNumber() / 100
      return `${gas} | ${percent.toFixed(2)}%`
    })

    watch(() => props.hash, selectHash)

    return {
      result,
      loading,
      error,
      CONFIG,
      percentGasUsed,
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

  & + & {
    margin-top: 0.4rem;
  }
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
