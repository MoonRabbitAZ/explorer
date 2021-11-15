<template>
  <div class="funds-list">
    <h1 class="funds-list__header">
      {{ $t('parachains-page.funds-list.ongoing-header') }}
    </h1>
    <template v-if="funds">
      <template v-if="funds.length">
        <div class="funds-list__body">
          <fund-row
            v-for="(fund, id) in funds"
            :key="id"
            class="funds-list__row"
            :fund="fund"
            :best-number="bestNumber"
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

import { reactive, toRefs } from 'vue'
import { BN } from '@polkadot/util'

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
    funds: { type: Array, default: null },
    leasePeriod: { type: Object, default: null },
    bestNumber: { type: BN, default: null },
  },

  setup (props) {
    const state = reactive({
      isInfoOpen: false,
      currentFund: null,
    })

    function openFundInfo (id) {
      state.currentFund = props.funds.find(({ paraId }) => paraId.eq(id))
      state.isInfoOpen = true
    }

    return {
      ...toRefs(state),
      openFundInfo,
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

.funds-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.funds-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}
</style>
