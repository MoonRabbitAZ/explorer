<template>
  <div class="evm-transaction-list">
    <div class="evm-transaction-list__body">
      <div
        class="evm-transaction-list__headers"
        :class="{'evm-transaction-list__headers--grid': transactions?.length}"
      >
        <h1>
          {{ $t('evm-explorer-page.evm-transaction-list.transactions-header') }}
        </h1>
        <template v-if="transactions?.length">
          <h4>
            {{ $t('evm-explorer-page.evm-transaction-list.from-header') }}
          </h4>
          <h4>
            {{ $t('evm-explorer-page.evm-transaction-list.to-header') }}
          </h4>
          <h4>
            {{ $t('evm-explorer-page.evm-transaction-list.amount-header') }}
          </h4>
          <h4>
            {{ $t('evm-explorer-page.evm-transaction-list.time-header') }}
          </h4>
          <h4>
            {{ $t('evm-explorer-page.evm-transaction-list.block-header') }}
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
          class="evm-transaction-list__no-data"
          :message="noDataMessage"
          is-row-block
        />
      </template>
    </div>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import EvmTransactionRow from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTransactionRow'

export default {
  name: 'evm-transaction-list',

  components: {
    NoDataMessage,
    EvmTransactionRow,
  },

  props: {
    transactions: { type: Array, required: true },
    currentAddress: { type: String, default: '' },
    noDataMessage: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-transaction-list__body {
  overflow-x: auto;

  @include scrollbar;
}

.evm-transaction-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    & > :nth-child(5) {
      grid-column: 6/8;
    }

    @include evm-transaction-grid-row(flex-end);
  }
}
</style>
