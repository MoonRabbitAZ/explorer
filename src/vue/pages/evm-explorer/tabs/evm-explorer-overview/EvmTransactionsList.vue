<template>
  <div class="evm-transactions-list">
    <div class="evm-transactions-list__body">
      <div
        class="evm-transactions-list__headers"
        :class="{'evm-transactions-list__headers--grid': transactions?.length}"
      >
        <h1>
          {{
            $t('evm-explorer-page.evm-transactions-list.transactions-header')
          }}
        </h1>
        <template v-if="transactions?.length">
          <h4>
            {{ $t('evm-explorer-page.evm-transactions-list.from-header') }}
          </h4>
          <h4>
            {{ $t('evm-explorer-page.evm-transactions-list.to-header') }}
          </h4>
          <h4>
            {{ $t('evm-explorer-page.evm-transactions-list.amount-header') }}
          </h4>
          <h4>
            {{ $t('evm-explorer-page.evm-transactions-list.time-header') }}
          </h4>
          <h4>
            {{ $t('evm-explorer-page.evm-transactions-list.block-header') }}
          </h4>
        </template>
      </div>
      <template v-if="transactions.length">
        <evm-transaction-row
          v-for="({node: transaction }) in transactions"
          :key="transaction.hash"
          :transaction="transaction"
          :current-address="currentAddress"
        />
      </template>
      <template v-else>
        <no-data-message
          class="evm-transactions-list__no-data"
          :message="noDataMessage"
          is-row-block
        />
      </template>
    </div>
    <pagination
      class="evm-transactions-list__pagination"
      @to-first-page="toFirstPage"
      @to-next-page="toNextPage"
      @to-previous-page="toPreviousPage"
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import EvmTransactionRow from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTransactionRow'
import Pagination from '@/vue/common/Pagination'

const EVENTS = {
  toFirstPage: 'to-first-page',
  toNextPage: 'to-next-page',
  toPreviousPage: 'to-previous-page',
}

export default {
  name: 'evm-transactions-list',

  components: {
    NoDataMessage,
    EvmTransactionRow,
    Pagination,
  },

  props: {
    transactions: { type: Array, required: true },
    currentAddress: { type: String, default: '' },
    noDataMessage: { type: String, required: true },
  },

  emits: Object.values(EVENTS),

  setup (_, { emit }) {
    function toFirstPage () { emit(EVENTS.toFirstPage) }
    function toNextPage () { emit(EVENTS.toNextPage) }
    function toPreviousPage () { emit(EVENTS.toPreviousPage) }

    return {
      toFirstPage,
      toNextPage,
      toPreviousPage,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-transactions-list__body {
  overflow-x: auto;

  @include scrollbar;
}

.evm-transactions-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    & > :nth-child(5) {
      grid-column: 6/8;
    }

    @include evm-transaction-grid-row(flex-end);
  }
}

.evm-transactions-list__pagination {
  margin: 2rem auto 0;
}
</style>
