<template>
  <div class="evm-block-list">
    <div
      class="evm-block-list__headers"
      :class="{'evm-block-list__headers--grid': blocks?.length}"
    >
      <h1>
        {{ $t('evm-explorer-page.evm-block-list.last-blocks-header') }}
      </h1>
      <template v-if="blocks?.length">
        <h4>
          {{ $t('evm-explorer-page.evm-block-list.transactions-header') }}
        </h4>
        <h4>
          {{ $t('evm-explorer-page.evm-block-list.time-header') }}
        </h4>
      </template>
    </div>
    <template v-if="blocks?.length">
      <evm-block-row
        v-for="block in blocks"
        :key="block.blockNumber"
        :block="block"
      />
    </template>
    <template v-else>
      <no-data-message
        class="evm-block-list__no-data"
        :message="noDataMessage"
        is-row-block
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import EvmBlockRow from '@evm-explorer-page/tabs/evm-explorer-overview/EvmBlockRow'

export default {
  name: 'evm-block-list',

  components: {
    NoDataMessage,
    EvmBlockRow,
  },

  props: {
    blocks: { type: Array, required: true },
    noDataMessage: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-block-list {
  overflow-x: auto;

  @include scrollbar;
}

.evm-block-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    & > :first-child {
      grid-column: 1/3;
    }

    @include evm-block-grid-row(flex-end);
  }
}

.evm-block-list__pagination {
  margin: 2rem auto 0;
}
</style>
