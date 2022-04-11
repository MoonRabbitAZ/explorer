<template>
  <div class="evm-token-transfer-full-row">
    <!-- Start first row -->
    <router-link
      class="evm-token-transfer-full-row__column"
      :to="{
        ...$routes.evmExplorerTransaction,
        query: {
          hash: tokenTransfer.transaction.hash,
        },
      }"
    >
      {{ tokenTransfer.transaction.hash }}
    </router-link>

    <div/>

    <router-link
      class="evm-token-transfer-full-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: { hash: tokenTransfer.transaction.fromAddressHash},
      }"
    >
      {{ tokenTransfer.transaction.fromAddressHash }}
    </router-link>
    <router-link
      class="evm-token-transfer-full-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: {
          hash: tokenTransfer.transaction.toAddressHash ||
            tokenTransfer.transaction.createdContractAddressHash
          },
      }"
    >
      {{ tokenTransfer.transaction.toAddressHash
        || tokenTransfer.transaction.createdContractAddressHash }}
    </router-link>
    <p>
      {{ $fExternalBalance(
        tokenTransfer.transaction.value,
        CONFIG.EVM_TOKEN_DECIMAL,
        CONFIG.EVM_TOKEN_TICKER
      ) }}
    </p>
    <p>
      {{ $fExternalBalance(
        tokenTransfer.transaction.gasUsed,
        CONFIG.EVM_TOKEN_DECIMAL,
        CONFIG.EVM_TOKEN_TICKER
      ) }}
    </p>

    <router-link
      class="evm-token-transfer-full-row__block-link"
      :to="{
        ...$routes.evmExplorerBlock,
        query: { blockNumber: tokenTransfer.blockNumber },
      }"
    >
      {{ $fnumber(tokenTransfer.blockNumber) }}
    </router-link>

    <!-- Start second row -->

    <p
      class="
      evm-token-transfer-full-row__type
      evm-token-transfer-full-row__column
      "
    >
      {{ type }}
    </p>

    <div>
      <i
        class="
          mdi
          mdi-subdirectory-arrow-right
          evm-token-transfer-full-row__arrow-icon
        "
        :class="{'evm-token-transfer-full-row__arrow-icon--out': isOutTransfer}"
      />
    </div>

    <router-link
      class="evm-token-transfer-full-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: {
          hash: tokenTransfer.fromAddressHash,
        },
      }"
    >
      {{ tokenTransfer.fromAddressHash }}
    </router-link>

    <router-link
      class="evm-token-transfer-full-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: {
          hash: tokenTransfer.toAddressHash,
        },
      }"
    >
      {{ tokenTransfer.toAddressHash }}
    </router-link>

    <p>
      {{ tokenDisplay }}
    </p>

    <transaction-status :status="tokenTransfer.transaction.status"/>

    <p :key="timeNow">
      {{ timeAgo() }}
    </p>
  </div>
</template>

<script>
import TransactionStatus from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionStatus'

import { computed } from 'vue'
import { useTokenTransferType } from '@evm-explorer-page/composables/useTokenTransferType'
import { useFormatBalance } from '@/vue/composables'
import moment from 'moment'

import { EVM_TOKEN_TYPES } from '@/js/const/evm-types.const'
import CONFIG from '@/config'

export default {
  name: 'evm-token-transfer-full-row',

  components: { TransactionStatus },

  props: {
    tokenTransfer: { type: Object, required: true },
    timeNow: { type: Date, required: true },
    currentAddress: { type: String, default: '' },
  },

  setup (props) {
    const { toExternalBalance } = useFormatBalance()
    const timeMoment = moment(props.tokenTransfer.transaction.timestamp)
    const timeAgo = _ => timeMoment.fromNow()
    const isOutTransfer =
      props.currentAddress === props.tokenTransfer.fromAddressHash
    const type = useTokenTransferType(props.tokenTransfer.tokenStatus)

    const tokenDisplay = computed(() => {
      const type = props.tokenTransfer.token.type
      if (type === EVM_TOKEN_TYPES.erc1155) {
        return type
      } else if (type === EVM_TOKEN_TYPES.erc20) {
        return toExternalBalance(
          props.tokenTransfer.amount,
          +props.tokenTransfer.token.decimals,
          props.tokenTransfer.token.symbol,
        )
      } else {
        return props.tokenTransfer.token.symbol
      }
    })

    return {
      isOutTransfer,
      type,
      timeAgo,
      tokenDisplay,
      CONFIG,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-token-transfer-full-row {
  @include content-block;
  @include evm-token-transfer-full-grid-row(center, 1rem);
}

.evm-token-transfer-full-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}

.evm-token-transfer-full-row__block-link {
  font-size: 1.6rem;
}

.evm-token-transfer-full-row__type {
  font-size: 1.6rem;
}

.evm-token-transfer-full-row__arrow-icon {
  font-size: 1.6rem;
  line-height: 1;
  letter-spacing: 0;

  &--out {
    color: $col-app-error;
  }
}
</style>
