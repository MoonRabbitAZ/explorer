<template>
  <div class="auctions-tab">
    <div class="auctions-tab__topbar">
      <auctions-summary class="auctions-tab__summary" />

      <app-button
        class="auctions-tab__bid-btn"
        scheme="primary"
        :text="$t('parachains-page.auctions-tab.bid-btn')"
        disabled="disabled"
      />
    </div>
    {{ auctionCounter }}
    {{ auctionInfo }}

    <bids-list />
  </div>
</template>

<script>
import AuctionsSummary from '@parachains-page/tabs/auctions/AuctionsSummary'
import BidsList from '@parachains-page/tabs/auctions/BidsList'

import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'auctions-tab',

  components: { BidsList, AuctionsSummary },

  setup () {
    const auctionCounter = useCall(api.query.auctions?.auctionCounter)
    const auctionInfo = useCall(api.query.auctions?.auctionInfo)

    return {
      auctionCounter,
      auctionInfo,
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

  @include respond-to($x-small) {
    width: 100%;
    flex-direction: column;
  }
}

.auctions-tab__summary {
  @include respond-to($x-small) {
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
