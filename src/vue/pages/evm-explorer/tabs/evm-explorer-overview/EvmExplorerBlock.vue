<template>
  <div class="evm-explorer-block">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else-if="error">
      <error-message :message="error.message"/>
    </template>
    <template v-else>
      <div class="evm-explorer-block__info">
        <info-value
          class="evm-explorer-block__info-row"
          :header="
            $t('evm-explorer-page.evm-explorer-block.block-height-header')
          "
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.block-height-info')
          "
          :value="result.block.number"
        />

        <info-value
          class="evm-explorer-block__info-row"
          :header="
            $t('evm-explorer-page.evm-explorer-block.timestamp-header')
          "
          :value="$fddmyt(result.block.timestamp)"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.timestamp-info')
          "
        />

        <info-value
          class="evm-explorer-block__info-row"
          :header="$t('evm-explorer-page.evm-explorer-block.validator-header')"
          :value="result.block.minerHash"
          :route-to="{
            ...$routes.evmExplorerAddress,
            params: {
              hash: result.block.minerHash,
            },
          }"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.validator-info')
          "
          with-clipboard
        />

        <info-value
          class="evm-explorer-block__info-row"
          :header="$t('evm-explorer-page.evm-explorer-block.size-header')"
          :value="$t('evm-explorer-page.evm-explorer-block.size-bytes-value', {
            size: result.block.size
          })"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.size-info')
          "
        />

        <info-value
          class="evm-explorer-block__info-row"
          :header="$t('evm-explorer-page.evm-explorer-block.hash-header')"
          :value="result.block.hash"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.hash-info')
          "
          with-clipboard
        />

        <info-value
          class="evm-explorer-block__info-row"
          :header="
            $t('evm-explorer-page.evm-explorer-block.parent-hash-header')
          "
          :value="result.block.parentHash"
          :route-to="$routes.app"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.parent-hash-info')
          "
          with-clipboard
        />

        <info-value
          class="evm-explorer-block__info-row"
          :header="
            $t('evm-explorer-page.evm-explorer-block.difficulty-header')
          "
          :value="result.block.difficulty"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.difficulty-info')
          "
        />

        <info-value
          class="evm-explorer-block__info-row"
          :header="
            $t('evm-explorer-page.evm-explorer-block.total-difficulty-header')
          "
          :value="result.block.totalDifficulty"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.total-difficulty-info')
          "
        />

        <info-value
          class="evm-explorer-block__info-row"
          :header="$t('evm-explorer-page.evm-explorer-block.gas-used-header')"
          :value="result.block.gasUsed"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.gas-used-info')
          "
        />
        <info-value
          class="evm-explorer-block__info-row"
          :header="$t('evm-explorer-page.evm-explorer-block.gas-limit-header')"
          :value="$fnumber(result.block.gasLimit)"
          :info-tooltip="
            $t('evm-explorer-page.evm-explorer-block.gas-limit-info')
          "
        />
        <info-value
          class="evm-explorer-block__info-row"
          :header="$t('evm-explorer-page.evm-explorer-block.nonce-header')"
          :value="result.block.nonce"
          :info-tooltip="$t('evm-explorer-page.evm-explorer-block.nonce-info')"
        />
      </div>

      <!-- eslint-disable max-len -->
      <evm-transactions-list
        class="evm-explorer-block__transactions-list"
        :block-number="result.block.number"
        :no-data-message="$t('evm-explorer-page.evm-explorer-address.no-data-message-transactions')"
      />
      <!-- eslint-enable max-len -->
    </template>
  </div>
</template>

<script>
import EvmTransactionsList from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTransactionsList'
import InfoValue from '@evm-explorer-page/tabs/evm-explorer-overview/InfoValue'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import GET_BLOCK from '@/graphql/queries/getBlock.gql'

export default {
  name: 'evm-explorer-block',

  components: { EvmTransactionsList, InfoValue, Loader, ErrorMessage },

  props: {
    blockNumber: { type: String, required: true },
  },

  setup (props) {
    const { result, variables, loading, error } =
      useQuery(GET_BLOCK, { number: +props.blockNumber })

    function selectBlockNumber () {
      variables.value = {
        number: +props.blockNumber,
      }
    }

    watch(() => props.blockNumber, selectBlockNumber)

    return {
      result,
      loading,
      error,
      console,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-explorer-block__info {
  @include content-block;
  padding: 1.8rem;
}

.evm-explorer-block__info-row {
  & + & {
    margin-top: 2.4rem;
  }
}

.evm-explorer-block__transactions-list {
  margin-top: 4rem;
}

</style>
