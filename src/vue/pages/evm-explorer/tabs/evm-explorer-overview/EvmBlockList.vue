<template>
  <div class="evm-block-list">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else-if="error">
      <error-message
        :message="$t('evm-explorer-page.evm-block-list.error-message')"
      />
    </template>
    <template v-else>
      <div class="evm-block-list__body">
        <div
          class="evm-block-list__headers"
          :class="{'evm-block-list__headers--grid': blocks?.length}"
        >
          <h1>
            {{ $t('evm-explorer-page.evm-block-list.last-blocks-header') }}
          </h1>
          <template v-if="blocks?.length">
            <h4>
              {{ $t('evm-explorer-page.evm-block-list.miner-header') }}
            </h4>
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
            v-for="({node: block}) in blocks"
            :key="block.number"
            :block="block"
            :time-now="timeNow"
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
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import EvmBlockRow from '@evm-explorer-page/tabs/evm-explorer-overview/EvmBlockRow'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { reactive, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import GET_BLOCK_LIST from '@/graphql/queries/getBlockList.gql'

const PAGE_LIMIT = 7

export default {
  name: 'evm-block-list',

  components: {
    Loader,
    ErrorMessage,
    NoDataMessage,
    EvmBlockRow,
  },

  props: {
    noDataMessage: { type: String, required: true },
    pollInterval: { type: Number, default: 0 },
    timeNow: { type: Date, required: true },
  },

  setup (props) {
    const variables = reactive({
      first: PAGE_LIMIT,
    })

    const options = reactive({
      ...(props.pollInterval ? { pollInterval: props.pollInterval } : {}),
      fetchPolicy: 'network-only',
    })

    const { result, loading, error } =
      useQuery(GET_BLOCK_LIST, variables, options)

    const blocks = computed(() => result.value?.blockList.edges)

    return {
      blocks,
      loading,
      error,
    }
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
    @include evm-block-grid-row(flex-end);
  }
}

.evm-block-list__pagination {
  margin: 2rem auto 0;
}
</style>
