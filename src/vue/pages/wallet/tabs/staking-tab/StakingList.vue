<template>
  <div class="staking-list">
    <div class="staking-list__body">
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
              v-for="staking in stakingList"
              :key="staking.id"
              v-model:is-processing-unstake="isProcessingUnstake"
              class="staking-list__row"
              :staking="staking"
              @withdrawn="collectionLoader.loadFirstPage"
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

    <collection-loader
      ref="collectionLoader"
      class="staking-list__collection-loader"
      :first-page-loader="getStakings"
      @first-page-load="setList"
      @next-page-load="concatList"
    />
  </div>
</template>

<script>
import StakingAccountRow from '@wallet-page/tabs/staking-tab/StakingAccountRow'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import CollectionLoader from '@/vue/common/CollectionLoader'

import { reactive, ref, toRefs, onMounted } from 'vue'
import { StakingRecord } from '@/js/records/staking.record'
import { stakingApi } from '@api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { STAKING_STATUSES } from '@/js/const/staking.const'

const STATUS_FILTER = [
  STAKING_STATUSES.pending,
  STAKING_STATUSES.active,
  STAKING_STATUSES.withdrawable,
].join(',')

export default {
  name: 'staking-list',

  components: {
    StakingAccountRow,
    NoDataMessage,
    ErrorMessage,
    SkeletonLoader,
    CollectionLoader,
  },

  props: {
    addresses: {
      type: Array,
      required: true,
    },
  },

  setup (props) {
    const collectionLoader = ref(null)
    const state = reactive({
      stakingList: [],
      isProcessingUnstake: false,
      isLoaded: false,
      isLoadFailed: false,
    })

    async function getStakings () {
      let response
      state.isLoaded = false
      state.isLoadFailed = false

      try {
        response = await stakingApi.get('api/staking', {
          page: {
            order: 'desc',
          },
          filter: {
            status: STATUS_FILTER,
            addresses: props.addresses.join(','),
          },
          include: ['stake_options'],
        })
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoaded = true
      return response
    }

    function setList (newList) {
      state.stakingList = newList.map(i => new StakingRecord(i))
    }

    function concatList (newChunk) {
      state.stakingList = state.stakingList.concat(
        newChunk.map(i => new StakingRecord(i)),
      )
    }

    onMounted(() => {
      Bus.on(
        Bus.eventList.updateStakingList,
        collectionLoader.value.loadFirstPage,
      )
    })

    return {
      ...toRefs(state),
      getStakings,
      setList,
      concatList,
      collectionLoader,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-list__body {
  overflow-x: auto;
  padding-bottom: 1rem;

  @include scrollbar;
}

.staking-list__header {
  margin-bottom: 2rem;
}

.staking-list__row {
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
