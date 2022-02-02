<template>
  <div class="evm-explorer-transaction" :key="hash">
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
      <h1 class="evm-explorer-transaction__header">
        {{ $t('evm-explorer-page.evm-explorer-transaction.transaction-details-header') }}
      </h1>
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
            query: { blockNumber: result.transaction.blockNumber },
          }"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.timestamp-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.timestamp-info')"
          :value="$fddmyts(result.transaction.timestamp)"
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.from-address-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.from-address-info')"
          :value="result.transaction.fromAddressHash"
          :route-to="{
            ...$routes.evmExplorerAddress,
            query: {
              hash: result.transaction.fromAddressHash,
            },
          }"
          with-clipboard
        />

        <info-value
          class="evm-explorer-transaction__info-row"
          :header="$t('evm-explorer-page.evm-explorer-transaction.to-address-header')"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-transaction.to-address-info')"
          :value="result.transaction.toAddressHash
            || result.transaction.createdContractAddressHash
          "
          :route-to="{
            ...$routes.evmExplorerAddress,
            query: {
              hash: result.transaction.toAddressHash
                || result.transaction.createdContractAddressHash,
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
          :value="gasPrice"
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
          :is-full-clipboard="false"
          with-clipboard
        />
      </div>

      <evm-token-transfers-list
        class="evm-explorer-transaction__list"
        :transaction-hash="hash"
        :time-now="timeNow"
        :no-data-message="$t('evm-explorer-page.evm-explorer-address.no-data-message-transactions')"
      />
      <!-- eslint-enable  max-len-->
    </template>
  </div>
</template>

<script>
import InfoValue from '@evm-explorer-page/tabs/evm-explorer-overview/InfoValue'
import TransactionStatus from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionStatus'
import EvmTokenTransfersList from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTokenTransfersList'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { watch, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { BN } from '@polkadot/util'
import { useTimeNow, useWeb3 } from '@/vue/composables'

import CONFIG from '@/config'
import GET_TRANSACTION from '@/graphql/queries/getTransaction.gql'

const ETHERE_UNIT_GWEI = 'Gwei'
export default {
  name: 'evm-explorer-transaction',

  components: {
    EvmTokenTransfersList,
    InfoValue,
    TransactionStatus,
    Loader,
    ErrorMessage,
  },

  props: {
    hash: { type: String, required: true },
  },

  setup (props) {
    const { web3 } = useWeb3()
    const timeNow = useTimeNow()
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

    const gasPrice = computed(() => {
      if (!result.value?.transaction?.gasPrice) return
      const amount = web3.value.utils.fromWei(
        result.value.transaction.gasPrice,
        ETHERE_UNIT_GWEI,
      )

      return `${amount} ${ETHERE_UNIT_GWEI}`
    })

    watch(() => props.hash, selectHash)

    return {
      timeNow,
      result,
      loading,
      error,
      CONFIG,
      percentGasUsed,
      gasPrice,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-explorer-transaction__header {
  margin-bottom: 3rem;
}

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

.evm-explorer-transaction__list {
  margin-top: 4rem;
}

</style>
