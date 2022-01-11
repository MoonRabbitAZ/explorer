<template>
  <div class="auctions-tab">
    <div class="auctions-tab__topbar">
      <auctions-summary
        class="auctions-tab__summary"
        :auction-info="auctionInfo"
        :last-winners-total-balance="winningData?.[0]?.total"
        :is-have-winners="Boolean(winningData?.length)"
      />

      <app-button
        class="auctions-tab__bid-btn"
        scheme="primary"
        :text="$t('parachains-page.auctions-tab.bid-btn')"
        disabled="disabled"
      />
    </div>

    <bids-list
      :winning-data="winningData"
      :funds="funds"
      :auction-info="auctionInfo"
    />
  </div>
</template>

<script>
import AuctionsSummary from '@parachains-page/tabs/auctions/AuctionsSummary'
import BidsList from '@parachains-page/tabs/auctions/BidsList'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { useWinningData } from '@parachains-page/composables/useWinningData'
import { useFunds } from '@parachains-page/composables/useFunds'
import { api } from '@api'
import { AuctionInfoRecord } from '@/js/records/auction-info.record'

export default {
  name: 'auctions-tab',

  components: { BidsList, AuctionsSummary },

  setup () {
    const auctionCounter = useCall(api.query.auctions?.auctionCounter)
    const auctionInfoCall = useCall(api.query.auctions?.auctionInfo)

    const auctionInfo = computed(() => {
      if (!auctionCounter.value || !auctionInfoCall.value) return null
      const [leasePeriod, endBlock] =
        auctionInfoCall.value?.unwrapOr([null, null])
      return new AuctionInfoRecord({
        leasePeriod,
        endBlock,
        numAuctions: auctionCounter.value,
      })
    })

    const winningData = useWinningData(auctionInfo)
    const { funds } = useFunds()

    return {
      auctionCounter,
      auctionInfo,
      winningData,
      funds,
      auctionInfoCall,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.auctions-tab { @include app-padding; }

.auctions-tab__topbar {
  display: flex;
  align-items: center;
  gap: 3.2rem;
  margin: 3rem 0;

  @include respond-to($medium) {
    flex-direction: column;
  }
}

.auctions-tab__summary {
  @include respond-to($medium) {
    width: 100%;
  }
}

.auctions-tab__bid-btn {
  margin-left: auto;

  @include respond-to($x-small) {
    width: 100%;
  }
}
</style>
