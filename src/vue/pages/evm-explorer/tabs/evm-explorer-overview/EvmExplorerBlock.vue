<template>
  <div class="evm-explorer-block">
    <template v-if="loading">
      <!--  -->
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
          :route-to="$routes.app"
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
    </template>
  </div>
</template>

<script>
import InfoValue from '@evm-explorer-page/tabs/evm-explorer-overview/InfoValue'
import { watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import GET_BLOCK from '@/graphql/queries/getBlock.gql'

export default {
  name: 'evm-explorer-block',

  components: { InfoValue },

  props: {
    blockNumber: { type: String, required: true },
  },

  setup (props) {
    const { result, variables, loading } =
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

</style>
