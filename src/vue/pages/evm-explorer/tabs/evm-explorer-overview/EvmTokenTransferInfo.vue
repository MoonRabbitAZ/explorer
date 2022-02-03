<template>
  <div class="evm-token-transfer-info">
    <value-displayer
      class="evm-token-transfer-info__indents"
      :header="$t('evm-explorer-page.evm-token-transfer-info.from-header')"
      :value="tokenTransfer.toAddressHash"
      :route="{
        ...$routes.evmExplorerAddress,
        query: { hash: tokenTransfer.toAddressHash},
      }"
    />

    <value-displayer
      class="evm-token-transfer-info__indents"
      :header="$t('evm-explorer-page.evm-token-transfer-info.to-header')"
      :value="tokenTransfer.toAddressHash"
      :route="{
        ...$routes.evmExplorerAddress,
        query: { hash: tokenTransfer.toAddressHash},
      }"
    />

    <value-displayer
      class="evm-token-transfer-info__indents"
      :header="
        $t('evm-explorer-page.evm-token-transfer-info.token-type-header')
      "
      :value="tokenTransfer.token.type"
    />

    <h3
      class="
      evm-token-transfer-info__header
      evm-token-transfer-info__indents
      "
    >
      {{ $t('evm-explorer-page.evm-token-transfer-info.for-header') }}
    </h3>

    <template v-if="tokenTransfer.token.type === EVM_TOKEN_TYPES.erc1155">
      <div
        class="evm-token-transfer-info__token"
        v-for="(id, index) in tokenTransfer.tokenIds"
        :key="id"
      >
        <value-displayer
          class="evm-token-transfer-info__token-info"
          :header="
            $t('evm-explorer-page.evm-token-transfer-info.token-id-header')
          "
          :value="id"
          :header-lvl="4"
        />

        <value-displayer
          class="evm-token-transfer-info__token-info"
          :header="
            $t('evm-explorer-page.evm-token-transfer-info.value-header')
          "
          :value="tokenTransfer.amounts[index]"
          :header-lvl="4"
        />
      </div>
    </template>
    <div
      v-else
      class="evm-token-transfer-info__token"
    >
      <template v-if="tokenTransfer.token.type === EVM_TOKEN_TYPES.erc20">
        <value-displayer
          class="evm-token-transfer-info__token-info"
          :header="
            $t('evm-explorer-page.evm-token-transfer-info.amount-header')
          "
          :value="$fExternalBalance(
            tokenTransfer.amount,
            +tokenTransfer.token.decimals,
            tokenTransfer.token.symbol
          )"
          :header-lvl="4"
        />
      </template>
      <template v-else>
        <value-displayer
          v-if="tokenTransfer.token.type === EVM_TOKEN_TYPES.erc721"
          class="evm-token-transfer-info__token-info"
          :header="
            $t('evm-explorer-page.evm-token-transfer-info.token-id-header')
          "
          :value="tokenTransfer.tokenId"
          :header-lvl="4"
        />

        <value-displayer
          class="evm-token-transfer-info__token-info"
          :header="
            $t('evm-explorer-page.evm-token-transfer-info.symbol-header')
          "
          :value="tokenTransfer.token.symbol"
          :header-lvl="4"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'

import { EVM_TOKEN_TYPES } from '@/js/const/evm-types.const'

export default {
  name: 'evm-token-transfer-info',

  components: { ValueDisplayer },

  props: {
    tokenTransfer: { type: Object, required: true },
  },

  setup () { return { EVM_TOKEN_TYPES } },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-token-transfer-info__token {
  padding: 2rem $drawer-padding;
  background: $col-app-block-bg;

  & + & {
    margin-top: 1rem;
  }
}

.evm-token-transfer-info__indents {
  padding: 0 $drawer-padding;

  & + & {
    margin-top: 2rem;
  }
}

.evm-token-transfer-info__header {
  color: $col-app-header-secondary;
  margin-bottom: 1rem;
}

.evm-token-transfer-info__token-info {
  & + & {
    margin-top: 2rem;
  }
}
</style>
