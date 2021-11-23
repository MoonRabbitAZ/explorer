<template>
  <div class="funds-list">
    <div class="funds-list__headers">
      <h1 class="funds-list__header">
        <template v-if="isOngoing">
          {{ $t('parachains-page.funds-list.ongoing-header') }}
        </template>
        <template v-else>
          {{ $t('parachains-page.funds-list.completed-header') }}
        </template>
      </h1>
      <template v-if="funds?.length">
        <h3>
          {{ $t('parachains-page.funds-list.status-header') }}
        </h3>
        <h3>
          {{ $t('parachains-page.funds-list.depositor-header') }}
        </h3>
      </template>
    </div>
    <template v-if="funds">
      <template v-if="funds.length">
        <div class="funds-list__body">
          <fund-row
            v-for="(fund, id) in funds"
            :key="id"
            class="funds-list__row"
            :fund="fund"
            :best-number="bestNumber"
            :is-ongoing="isOngoing"
            @open-fund-info="openFundInfo"
          />
        </div>
      </template>
      <template v-else>
        <no-data-message
          class="funds-list__no-data"
          :message="
            $t('parachains-page.funds-list.no-data-message')
          "
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>

    <drawer
      v-model:is-shown="isInfoOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('parachains-page.funds-list.drawer-title') }}
      </template>
      <fund-info
        :fund="currentFund"
        :best-number="bestNumber"
        :lease-period="leasePeriod"
        :is-ongoing="isOngoing"
      />
    </drawer>
  </div>
</template>

<script>
import FundRow from '@parachains-page/tabs/crowdloan/FundRow'
import FundInfo from '@parachains-page/tabs/crowdloan/FundInfo'
import Drawer from '@/vue/common/Drawer'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { reactive, toRefs, computed } from 'vue'
import { BN } from '@polkadot/util'
import { LeasePeriodRecord } from '@/js/records/lease-period.record'

export default {
  name: 'funds-list',

  components: {
    FundRow,
    Drawer,
    SkeletonLoader,
    NoDataMessage,
    FundInfo,
  },

  props: {
    funds: {
      type: Array, /** {@link FundRecord} **/
      default: null,
    },
    leasePeriod: { type: LeasePeriodRecord, default: null },
    bestNumber: { type: BN, default: null },
    isOngoing: { type: Boolean, default: false },
  },

  setup (props) {
    const state = reactive({
      isInfoOpen: false,
      currentParaId: '',
    })
    function openFundInfo (id) {
      state.currentParaId = id
      state.isInfoOpen = true
    }

    const currentFund = computed(() =>
      props.funds?.find(({ paraId }) => paraId.eq(state.currentParaId)),
    )

    return {
      ...toRefs(state),
      openFundInfo,
      currentFund,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.funds-list {
  overflow-x: auto;

  @include scrollbar;
}

.funds-list__headers {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 15rem 12rem minmax(15rem, 1fr) 4.4rem;
  align-items: flex-end;
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.funds-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}
</style>
