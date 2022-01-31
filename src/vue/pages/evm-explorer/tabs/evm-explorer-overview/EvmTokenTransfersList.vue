<template>
  <div class="evm-token-transfers-list">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else-if="error">
      <error-message
        :message="error.message"
      />
    </template>
    <template v-else>
      <div class="evm-token-transfers-list__body">
        <div
          class="evm-token-transfers-list__headers"
          :class="{
            'evm-token-transfers-list__headers--grid':
              tokenTransfers?.length && !addressHash,
            'evm-token-transfers-list__headers--grid-with-direction':
              tokenTransfers?.length && addressHash
          }"
        >
          <!-- eslint-disable  max-len -->
          <h1>
            {{ $t('evm-explorer-page.evm-token-transfers-list.token-transfers-header') }}
          </h1>
          <template v-if="tokenTransfers?.length">
            <h4>
              {{ $t('evm-explorer-page.evm-token-transfers-list.from-header') }}
            </h4>
            <h4>
              {{ $t('evm-explorer-page.evm-token-transfers-list.to-header') }}
            </h4>
            <h4>
              {{ $t('evm-explorer-page.evm-token-transfers-list.amount-header') }}
            </h4>
            <h4>
              {{ $t('evm-explorer-page.evm-token-transfers-list.time-header') }}
            </h4>
            <h4>
              {{ $t('evm-explorer-page.evm-token-transfers-list.block-header') }}
            </h4>
          </template>
          <!-- eslint-enable  max-len -->
        </div>
        <template v-if="tokenTransfers.length">
          <evm-token-transfer-row
            v-for="({node: tokenTransfer }) in tokenTransfers"
            :key="tokenTransfer.id"
            :token-transfer="tokenTransfer"
          />
        </template>
        <template v-else>
          <no-data-message
            class="evm-token-transfers-list__no-data"
            :message="noDataMessage"
            :time-now="timeNow"
            is-row-block
          />
        </template>
      </div>
      <pagination
        class="evm-token-transfers-list__pagination"
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
import EvmTokenTransferRow from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTokenTransferRow'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Pagination from '@/vue/common/Pagination'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { reactive, toRefs, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import GET_TOKEN_TRANSFERS from '@/graphql/queries/getTokenTransfers.gql'

const PAGE_LIMIT = 7

export default {
  name: 'evm-token-transfers-list',

  components: {
    Loader,
    ErrorMessage,
    NoDataMessage,
    EvmTokenTransferRow,
    Pagination,
  },

  props: {
    timeNow: { type: Date, required: true },
    addressHash: { type: String, default: '' },
    transactionHash: { type: String, default: '' },
    noDataMessage: { type: String, required: true },
  },

  setup (props) {
    const state = reactive({
      paginationPage: 1,
      isLoadedPage: false,
    })
    const variables = reactive({
      ...(props.addressHash ? { actorAddressHash: props.addressHash } : {}),
      ...(props.transactionHash
        ? { transactionHash: props.transactionHash }
        : {}
      ),
      count: PAGE_LIMIT,
      last: PAGE_LIMIT,
    })

    const { result, loading, error, fetchMore, refetch, onResult } =
      useQuery(GET_TOKEN_TRANSFERS, variables, { fetchPolicy: 'network-only' })

    const pageInfo = computed(() => result.value?.tokenTransfers.pageInfo)

    const tokenTransfers = computed(() => result.value?.tokenTransfers.edges)

    function loadMore (isNext = false) {
      state.isLoadedPage = true
      if (isNext) { ++state.paginationPage } else { --state.paginationPage }
      fetchMore({
        query: GET_TOKEN_TRANSFERS,
        variables: {
          ...(props.addressHash ? { actorAddressHash: props.addressHash } : {}),
          ...(props.transactionHash
            ? { transactionHash: props.transactionHash }
            : {}
          ),
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
      tokenTransfers,
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

.evm-token-transfers-list__body {
  overflow-x: auto;

  @include scrollbar;
}

.evm-token-transfers-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    & > :nth-child(5) {
      grid-column: 6/7;
    }

    @include evm-transaction-grid-row(flex-end);
  }

  &--grid-with-direction {
    & > :nth-child(5) {
      grid-column: 6/8;
    }

    @include evm-transaction-with-direction-grid-row(flex-end);
  }
}

.evm-token-transfers-list__pagination {
  margin: 2rem auto 0;
}
</style>
