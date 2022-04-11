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
      {{ tokenDisplay }}
    </p>
    <div>
      <app-button
        mdi-icon-name="mdi-information-outline"
        scheme="secondary"
        @click="openInfo"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTokenTransferType } from '@evm-explorer-page/composables/useTokenTransferType'
import { useFormatBalance } from '@/vue/composables'

import { EVM_TOKEN_TYPES } from '@/js/const/evm-types.const'
import CONFIG from '@/config'

const EVENTS = {
  openInfo: 'open-info',
}

export default {
  name: 'evm-token-transfer-row',

  props: {
    tokenTransfer: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { toExternalBalance } = useFormatBalance()
    const type = useTokenTransferType(props.tokenTransfer.tokenStatus)

    function openInfo () {
      emit(EVENTS.openInfo, {
        id: props.tokenTransfer.id,
        type,
      })
    }

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
      type,
      openInfo,
      tokenDisplay,
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
