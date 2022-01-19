<template>
  <div class="evm-explorer-overview">
    <evm-block-list
      :blocks="HURDCODE_BLOCKS"
      :no-data-message="
        $t('evm-explorer-page.evm-explorer-overview.no-data-message-blocks')
      "
    />
  </div>
</template>

<script>
import EvmBlockList from '@evm-explorer-page/tabs/evm-explorer-overview/EvmBlockList'

export default {
  name: 'evm-explorer-overview',

  components: { EvmBlockList },

  setup () {
    const HURDCODE_BLOCKS = [
      {
        blockNumber: 204324,
        miner: '0xa3ea6588F988D35B78927707C13a3e785f2B05D9',
        transactions: 23,
        timestamp: '2022-01-19 16:52:48.000000Z',
      },
    ]

    return { HURDCODE_BLOCKS }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

</style>
