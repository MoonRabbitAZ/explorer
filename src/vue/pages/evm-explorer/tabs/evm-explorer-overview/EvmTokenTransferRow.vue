<template>
  <div class="evm-token-transfer-row">
    <router-link
      class="evm-token-transfer-row__column"
      :to="{
        ...$routes.evmExplorerTransaction,
        params: {
          hash: tokenTransfer.transactionHash,
        },
      }"
    >
      {{ tokenTransfer.transactionHash }}
    </router-link>
    <router-link
      class="evm-token-transfer-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        params: { hash: tokenTransfer?.fromAddressHash},
      }"
    >
      {{ tokenTransfer.fromAddressHash }}
    </router-link>
    <router-link
      class="evm-token-transfer-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        params: {
          hash: tokenTransfer?.toAddressHash ||
            tokenTransfer.createdContractAddressHash
          },
      }"
    >
      {{ tokenTransfer.toAddressHash
        || tokenTransfer.createdContractAddressHash }}
    </router-link>
    <p>
      {{ $fExternalBalance(
        tokenTransfer.value,
        CONFIG.EVM_TOKEN_DECIMAL,
        CONFIG.EVM_TOKEN_TICKER
      ) }}
    </p>
    <transaction-status :status="tokenTransfer.status"/>
    <p :key="timeNow">
      {{ timeAgo() }}
    </p>
    <router-link
      class="evm-token-transfer-row__block-link"
      :to="{
        ...$routes.evmExplorerBlock,
        params: { blockNumber: tokenTransfer.blockNumber },
      }"
    >
      {{ $fnumber(tokenTransfer.blockNumber) }}
    </router-link>
  </div>
</template>

<script>
import TransactionStatus from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionStatus'

import moment from 'moment'

import CONFIG from '@/config'

export default {
  name: 'evm-token-transfer-row',

  components: { TransactionStatus },

  props: {
    tokenTransfer: { type: Object, required: true },
    timeNow: { type: Date, required: true },
    currentAddress: { type: String, default: '' },
  },

  setup (props) {
    const timeMoment = moment(props.tokenTransfer.timestamp)

    const timeAgo = _ => timeMoment.fromNow()

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

.evm-token-transfer-row {
  @include content-block;
  @include evm-transaction-grid-row(center, 1rem);
}

.evm-token-transfer-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}

.evm-token-transfer-row__block-link {
  font-size: 1.6rem;
}
</style>
