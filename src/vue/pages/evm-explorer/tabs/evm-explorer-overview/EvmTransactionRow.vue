<template>
  <div class="evm-transaction-row">
    <router-link
      class="evm-transaction-row__column"
      :to="{
        ...$routes.evmExplorerTransaction,
        params: {
          hash: transaction.hash,
        },
      }"
    >
      {{ transaction.hash }}
    </router-link>
    <router-link
      class="evm-transaction-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        params: { hash: transaction.fromAddressHash },
      }"
    >
      {{ transaction.fromAddressHash }}
    </router-link>
    <router-link
      class="evm-transaction-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        params: { hash: transaction.toAddressHash },
      }"
    >
      {{ transaction.toAddressHash }}
    </router-link>
    <p>
      {{ $fExternalBalance(
        transaction.value,
        CONFIG.EVM_TOKEN_DECIMAL,
        CONFIG.EVM_TOKEN_TICKER
      ) }}
    </p>
    <transaction-status :status="transaction.status"/>
    <p>
      {{ timeAgo }}
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
        params: { blockNumber: transaction.blockNumber },
      }"
    >
      {{ $fnumber(transaction.blockNumber) }}
    </router-link>
  </div>
</template>

<script>
import TransactionStatus from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionStatus'
import TransactionDirection from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionDirection'

import { computed } from 'vue'
import moment from 'moment'

import CONFIG from '@/config'

export default {
  name: 'evm-transaction-row',

  components: { TransactionStatus, TransactionDirection },

  props: {
    transaction: { type: Object, required: true },
    currentAddress: { type: String, default: '' },
  },

  setup () {
    const timeAgo = computed(() => moment().fromNow())

    return {
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
  @include evm-transaction-grid-row(center, 1rem);
  @include content-block;
}

.evm-transaction-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}

.evm-transaction-row__block-link {
  font-size: 1.6rem;
}
</style>
