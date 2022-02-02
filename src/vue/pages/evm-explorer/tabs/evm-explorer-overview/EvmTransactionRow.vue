<template>
  <div
    class="evm-transaction-row"
    :class="{'evm-transaction-row--with-direction': currentAddress}"
  >
    <div class="evm-transaction-row__column">
      <p class="evm-transaction-row__type">
        {{ type }}
      </p>
      <router-link
        :to="{
          ...$routes.evmExplorerTransaction,
          query: {
            hash: transaction.hash,
          },
        }"
      >
        {{ transaction.hash }}
      </router-link>
    </div>
    <router-link
      class="evm-transaction-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: { hash: transaction?.fromAddressHash},
      }"
    >
      {{ transaction.fromAddressHash }}
    </router-link>
    <router-link
      class="evm-transaction-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: {
          hash: transaction?.toAddressHash ||
            transaction.createdContractAddressHash
          },
      }"
    >
      {{ transaction.toAddressHash || transaction.createdContractAddressHash }}
    </router-link>
    <p>
      {{ $fExternalBalance(
        transaction.value,
        CONFIG.EVM_TOKEN_DECIMAL,
        CONFIG.EVM_TOKEN_TICKER
      ) }}
    </p>
    <p>
      {{ $fExternalBalance(
        transaction.cumulativeGasUsed,
        CONFIG.EVM_TOKEN_DECIMAL,
        CONFIG.EVM_TOKEN_TICKER
      ) }}
    </p>
    <transaction-status :status="transaction.status"/>
    <p :key="timeNow">
      {{ timeAgo() }}
    </p>
    <transaction-direction
      v-if="currentAddress"
      :current-address="currentAddress"
      :from-address="transaction.fromAddressHash"
    />
    <router-link
      class="evm-transaction-row__block-link"
      :to="{
        ...$routes.evmExplorerBlock,
        query: { blockNumber: transaction.blockNumber },
      }"
    >
      {{ $fnumber(transaction.blockNumber) }}
    </router-link>
  </div>
</template>

<script>
import TransactionStatus from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionStatus'
import TransactionDirection from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionDirection'

import { useTransactionType } from '@evm-explorer-page/composables/useTransactionType'
import moment from 'moment'

import CONFIG from '@/config'

export default {
  name: 'evm-transaction-row',

  components: { TransactionStatus, TransactionDirection },

  props: {
    transaction: { type: Object, required: true },
    timeNow: { type: Date, required: true },
    currentAddress: { type: String, default: '' },
  },

  setup (props) {
    const type = useTransactionType(props.transaction.type)
    const timeMoment = moment(props.transaction.timestamp)

    const timeAgo = _ => timeMoment.fromNow()

    return {
      type,
      timeAgo,
      CONFIG,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-transaction-row {
  @include content-block;
  @include evm-transaction-grid-row(center, 1rem);

  &--with-direction {
    @include evm-transaction-with-direction-grid-row(center, 1rem);
  }
}

.evm-transaction-row__type {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.evm-transaction-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}

.evm-transaction-row__block-link {
  font-size: 1.6rem;
}
</style>
