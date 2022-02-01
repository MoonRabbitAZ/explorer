<template>
  <div class="evm-token-transfer-full-row">
    <!-- Start first row -->
    <router-link
      class="evm-token-transfer-full-row__column"
      :to="{
        ...$routes.evmExplorerTransaction,
        params: {
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
        params: { hash: tokenTransfer.transaction.fromAddressHash},
      }"
    >
      {{ tokenTransfer.transaction.fromAddressHash }}
    </router-link>
    <router-link
      class="evm-token-transfer-full-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        params: {
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
        tokenTransfer.transaction.cumulativeGasUsed,
        CONFIG.EVM_TOKEN_DECIMAL,
        CONFIG.EVM_TOKEN_TICKER
      ) }}
    </p>

    <router-link
      class="evm-token-transfer-full-row__block-link"
      :to="{
        ...$routes.evmExplorerBlock,
        params: { blockNumber: tokenTransfer.blockNumber },
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
        ...$routes.evmExplorerTransaction,
        params: {
          hash: tokenTransfer.fromAddressHash,
        },
      }"
    >
      {{ tokenTransfer.fromAddressHash }}
    </router-link>

    <router-link
      class="evm-token-transfer-full-row__column"
      :to="{
        ...$routes.evmExplorerTransaction,
        params: {
          hash: tokenTransfer.toAddressHash,
        },
      }"
    >
      {{ tokenTransfer.toAddressHash }}
    </router-link>

    <p v-if="tokenTransfer.token.type === 'ERC-721'">
      {{ tokenTransfer.token.symbol }}
    </p>
    <p v-else-if="tokenTransfer.token.type === 'ERC-20'">
      {{ $fExternalBalance(
        tokenTransfer.amount,
        +tokenTransfer.token.decimals,
        tokenTransfer.token.symbol
      ) }}
    </p>
    <p v-else-if="tokenTransfer.token.type === 'ERC-1155'">
      {{ tokenTransfer.token.type }}
    </p>

    <transaction-status :status="tokenTransfer.status"/>

    <p :key="timeNow">
      {{ timeAgo() }}
    </p>
  </div>
</template>

<script>
import TransactionStatus from '@evm-explorer-page/tabs/evm-explorer-overview/TransactionStatus'

import { useI18n } from 'vue-i18n'
import moment from 'moment'

import CONFIG from '@/config'
import { EVM_TOKEN_TRANSFERS_TYPES } from '@/js/const/evm-transaction-types.const'

export default {
  name: 'evm-token-transfer-full-row',

  components: { TransactionStatus },

  props: {
    tokenTransfer: { type: Object, required: true },
    timeNow: { type: Date, required: true },
    currentAddress: { type: String, default: '' },
  },

  setup (props) {
    const { t } = useI18n()
    const timeMoment = moment(props.tokenTransfer.timestamp)
    const timeAgo = _ => timeMoment.fromNow()

    const isOutTransfer =
      props.currentAddress === props.tokenTransfer.fromAddressHash

    let type

    switch (type) {
      case EVM_TOKEN_TRANSFERS_TYPES.burning:
        type = t('evm-explorer-page.evm-token-transfer-full-row.burning-type')
        break
      case EVM_TOKEN_TRANSFERS_TYPES.spawning:
        type = t('evm-explorer-page.evm-token-transfer-full-row.spawning-type')
        break
      case EVM_TOKEN_TRANSFERS_TYPES.minting:
        type = t('evm-explorer-page.evm-token-transfer-full-row.minting-type')
        break
      case EVM_TOKEN_TRANSFERS_TYPES.transfer:
        type = t('evm-explorer-page.evm-token-transfer-full-row.transfer-type')
        break
      default:
        type = 'undefined'
    }

    return {
      isOutTransfer,
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
  margin-bottom: 1rem;
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
