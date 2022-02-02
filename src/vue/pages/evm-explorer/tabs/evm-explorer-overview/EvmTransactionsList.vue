<template>
  <div class="evm-transactions-list">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else-if="error">
      <error-message :message="error.message"/>
    </template>
    <template v-else>
      <div class="evm-transactions-list__body">
        <div
          class="evm-transactions-list__headers"
          :class="{
            'evm-transactions-list__headers--grid':
              transactions?.length && !addressHash,
            'evm-transactions-list__headers--grid-with-direction':
              transactions?.length && addressHash
          }"
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
            :current-address="addressHash"
            :time-now="timeNow"
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
        v-if="withPagination"
        class="evm-transactions-list__pagination"
        @to-first-page="toFirstPage"
        @to-next-page="loadMore(true)"
        @to-previous-page="loadMore"
        :has-next-page="pageInfo?.hasNextPage"
        :has-prev-page="pageInfo?.hasPreviousPage"
        :page-number="paginationPage"
        :is-loaded="isLoadedPage"
      />
    </template>
  </div>
</template>

<script>
import EvmTransactionRow from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTransactionRow'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Pagination from '@/vue/common/Pagination'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { reactive, toRefs, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import GET_TRANSACTIONS from '@/graphql/queries/getTransactions.gql'

const PAGE_LIMIT = 7

export default {
  name: 'evm-transactions-list',

  components: {
    Loader,
    ErrorMessage,
    NoDataMessage,
    EvmTransactionRow,
    Pagination,
  },

  props: {
    timeNow: { type: Date, required: true },
    noDataMessage: { type: String, required: true },
    blockNumber: { type: Number, default: null },
    addressHash: { type: String, default: null },
    withPagination: { type: Boolean, default: true },
    pollInterval: { type: Number, default: 0 },
  },

  setup (props) {
    const state = reactive({
      paginationPage: 1,
      isLoadedPage: false,
    })
    const variables = reactive({
      ...(props.blockNumber ? { blockNumber: props.blockNumber } : {}),
      ...(props.addressHash ? { addressHash: props.addressHash } : {}),
      count: PAGE_LIMIT,
      first: PAGE_LIMIT,
    })

    const options = reactive({
      ...(props.pollInterval ? { pollInterval: props.pollInterval } : {}),
      fetchPolicy: 'network-only',
    })

    const { result, loading, error, fetchMore, refetch, onResult } =
      useQuery(GET_TRANSACTIONS, variables, options)

    const pageInfo = computed(() => result.value?.transactions.pageInfo)

    const transactions = computed(() => result.value?.transactions.edges)

    function loadMore (isNext = false) {
      state.isLoadedPage = true
      if (isNext) { ++state.paginationPage } else { --state.paginationPage }
      fetchMore({
        query: GET_TRANSACTIONS,
        variables: {
          ...(props.blockNumber ? { blockNumber: props.blockNumber } : {}),
          ...(props.addressHash ? { addressHash: props.addressHash } : {}),
          ...(isNext
            ? {
                after: pageInfo.value.endCursor,
                first: PAGE_LIMIT,
              }
            : {
                before: pageInfo.value.startCursor,
                last: PAGE_LIMIT,
              }
          ),
        },
      })
    }

    onResult(() => { state.isLoadedPage = false })

    function toFirstPage () {
      state.isLoadedPage = true
      state.paginationPage = 1
      refetch(variables)
    }

    return {
      ...toRefs(state),
      loading,
      error,
      transactions,
      loadMore,
      pageInfo,
      toFirstPage,
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
    & > :nth-child(6) {
      grid-column: 7/8;
    }

    @include evm-transaction-grid-row(flex-end);
  }

  &--grid-with-direction {
    & > :nth-child(6) {
      grid-column: 7/9;
    }

    @include evm-transaction-with-direction-grid-row(flex-end);
  }
}

.evm-transactions-list__pagination {
  margin: 2rem auto 0;
}
</style>
