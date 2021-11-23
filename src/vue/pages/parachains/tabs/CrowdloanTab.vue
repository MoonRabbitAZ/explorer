<template>
  <div class="crowdloan-tab">
    <div class="crowdloan-tab__topbar">
      <crowdloan-summary
        class="crowdloan-tab__summary"
        :fund-count="funds ? funds.length : 0"
        :active-cap="activeCap"
        :active-raised="activeRaised"
        :total-cap="totalCap"
        :total-raised="totalRaised"
      />

      <app-button
        class="crowdloan-tab__add-fund-btn"
        scheme="primary"
        :text="$t('parachains-page.crowdloan-tab.add-fund-btn')"
        disabled="disabled"
      />
    </div>
    <funds-list
      class="crowdloan-tab__fund-list"
      :funds="activeFunds"
      :lease-period="leasePeriod"
      :best-number="bestNumber"
      is-ongoing
    />
    <funds-list
      class="crowdloan-tab__fund-list"
      :funds="endedFunds"
      :lease-period="leasePeriod"
      :best-number="bestNumber"
    />
  </div>
</template>

<script>
import CrowdloanSummary from '@parachains-page/tabs/crowdloan/CrowdloanSummary'
import FundsList from '@parachains-page/tabs/crowdloan/FundsList'

import { computed } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { useLeasePeriod } from '@parachains-page/composables/useLeasePeriod'
import { useFunds } from '@parachains-page/composables/useFunds'

export default {
  name: 'crowdloan-tab',

  components: {
    CrowdloanSummary,
    FundsList,
  },

  setup () {
    const bestNumber = useCall(api.derive.chain.bestNumber)
    const { leasePeriod } = useLeasePeriod()
    const {
      activeCap,
      activeRaised,
      funds,
      totalCap,
      totalRaised,
    } = useFunds()

    const activeFunds = computed(() => {
      if (!funds.value || !leasePeriod.value?.currentPeriod) return
      const currentPeriod = leasePeriod.value.currentPeriod
      return funds.value.filter(({ firstSlot, isCapped, isEnded, isWinner }) =>
        !(isCapped || isEnded || isWinner) && currentPeriod.lte(firstSlot),
      )
    })

    const endedFunds = computed(() => {
      if (!funds.value || !leasePeriod.value?.currentPeriod) return
      const currentPeriod = leasePeriod.value.currentPeriod
      return funds.value.filter(({ firstSlot, isCapped, isEnded, isWinner }) =>
        (isCapped || isEnded || isWinner) || currentPeriod.gt(firstSlot),
      )
    })

    return {
      funds,
      leasePeriod,
      activeFunds,
      endedFunds,
      bestNumber,
      activeCap,
      activeRaised,
      totalCap,
      totalRaised,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.crowdloan-tab { @include app-padding; }

.crowdloan-tab__topbar {
  display: flex;
  align-items: center;
  gap: 3.2rem;
  margin: 3rem 0;

  @include respond-to($x-medium) {
    flex-direction: column;
  }
}

.crowdloan-tab__summary {
  @include respond-to($tablet) {
    width: 100%;
  }
}

.crowdloan-tab__add-fund-btn {
  margin-left: auto;

  @include respond-to($x-small) {
    width: 100%;
  }
}

.crowdloan-tab__fund-list {
  & + & {
    margin-top: 3rem;
  }
}
</style>
