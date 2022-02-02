<template>
  <div class="evm-token-transfer-row">
    <p class="evm-token-transfer-row__type evm-token-transfer-row__column">
      {{ type }}
    </p>

    <p class="evm-token-transfer-row__column">
      {{ tokenTransfer.transaction.hash }}
    </p>

    <router-link
      class="evm-token-transfer-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: { hash: tokenTransfer.fromAddressHash},
      }"
    >
      {{ tokenTransfer.fromAddressHash }}
    </router-link>
    <router-link
      class="evm-token-transfer-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: {
          hash: tokenTransfer.toAddressHash
        },
      }"
    >
      {{ tokenTransfer.toAddressHash }}
    </router-link>

    <p>
      {{ $fExternalBalance(
        tokenTransfer.value,
        CONFIG.EVM_TOKEN_DECIMAL,
        CONFIG.EVM_TOKEN_TICKER
      ) }}
    </p>
  </div>
</template>

<script>
import { useTokenTransferType } from '@evm-explorer-page/composables/useTokenTransferType'

import CONFIG from '@/config'
export default {
  name: 'evm-token-transfer-row',

  props: {
    tokenTransfer: { type: Object, required: true },
  },

  setup (props) {
    const type = useTokenTransferType(props.tokenTransfer.tokenStatus)

    return {
      type,
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
  @include evm-token-transfer-grid-row(center, 1rem);
}

.evm-token-transfer-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}

.evm-token-transfer-row__block-link {
  font-size: 1.6rem;
}

.evm-token-transfer-row__type {
  font-size: 1.6rem;
}
</style>
