<template>
  <div class="staking-list">
    <h1 class="staking-list__header">
      {{ $t('wallet-page.staking-list.staking-header') }}
    </h1>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :header="$t('wallet-page.staking-list.error-header')"
          :message="$t('wallet-page.staking-list.error-message')"
        />
      </template>
      <template v-else>
        <template v-if="stakingList.length">
          <staking-account-row
            v-model:is-processing-unstake="isProcessingUnstake"
            v-for="staking in stakingList"
            :key="staking.id"
            class="staking-list__row"
            :staking="staking"
            @withdrawn="getStakings"
          />
        </template>
        <template v-else>
          <no-data-message
            is-row-block
            :message="$t('wallet-page.staking-list.no-data-message')"
          />
        </template>
      </template>
    </template>
    <template v-else>
      <skeleton-loader
        v-for="i in 3"
        :key="i"
        class="staking-list__skeleton"
      />
    </template>
  </div>
</template>

<script>
import StakingAccountRow from '@wallet-page/tabs/staking-tab/StakingAccountRow'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { reactive, toRefs, watch } from 'vue'
import { StakingRecord } from '@/js/records/staking.record'
import { stakingApi } from '@api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { STAKING_STATUSES } from '@/js/const/staking.const'

export default {
  name: 'staking-list',

  components: {
    StakingAccountRow,
    NoDataMessage,
    ErrorMessage,
    SkeletonLoader,
  },

  props: {
    addresses: {
      type: Array,
      required: true,
    },
  },

  setup (props) {
    const state = reactive({
      stakingList: [],
      isProcessingUnstake: false,
      isLoaded: false,
      isLoadFailed: false,
    })

    async function getStakings () {
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        const stakings = await Promise.all(
          props.addresses.map(async (address) =>
            stakingApi.get(`api/staking/${address}`, {
              page: {
                order: 'desc',
                limit: 100,
              },
              filter: {
                status: `${STAKING_STATUSES.pending},${STAKING_STATUSES.active},${STAKING_STATUSES.withdrawable}`,
              },
            }),
          ))

        state.stakingList = stakings.map(({ data }) => data)
          .flat()
          .map(i => new StakingRecord(i))
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }

      state.isLoaded = true
    }

    watch(() => props.addresses, getStakings, { immediate: true })
    Bus.on('updateStakingList', getStakings)

    return {
      ...toRefs(state),
      getStakings,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-list {
  overflow-x: auto;
  padding-bottom: 1rem;

  @include scrollbar;
}

.staking-list__header {
  margin-bottom: 2rem;
}

.staking-list__row {
  min-width: 75rem;

  & + & {
    margin-top: 0.4rem;
  }
}

.staking-list__skeleton {
  height: 6.4rem;

  & + & {
    margin-top: 0.4rem;
  }
}
</style>
