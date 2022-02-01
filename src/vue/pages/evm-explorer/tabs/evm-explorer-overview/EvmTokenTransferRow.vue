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
        params: { hash: tokenTransfer.fromAddressHash},
      }"
    >
      {{ tokenTransfer.fromAddressHash }}
    </router-link>
    <router-link
      class="evm-token-transfer-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        params: {
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
import { useI18n } from 'vue-i18n'

import CONFIG from '@/config'
import { EVM_TOKEN_TRANSFERS_TYPES } from '@/js/const/evm-transaction-types.const'

export default {
  name: 'evm-token-transfer-row',

  props: {
    tokenTransfer: { type: Object, required: true },
  },

  setup (props) {
    const { t } = useI18n()

    let type

    switch (props.tokenTransfer.type) {
      case EVM_TOKEN_TRANSFERS_TYPES.burning:
        type = t('evm-explorer-page.evm-token-transfer-row.burning-type')
        break
      case EVM_TOKEN_TRANSFERS_TYPES.spawning:
        type = t('evm-explorer-page.evm-token-transfer-row.spawning-type')
        break
      case EVM_TOKEN_TRANSFERS_TYPES.minting:
        type = t('evm-explorer-page.evm-token-transfer-row.minting-type')
        break
      case EVM_TOKEN_TRANSFERS_TYPES.transfer:
        type = t('evm-explorer-page.evm-token-transfer-row.transfer-type')
        break
      default:
        type = 'undefined'
    }

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
