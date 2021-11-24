<template>
  <div class="bids-list">
    <div class="bids-list__headers-wrap">
      <h1 class="bids-list__header">
        {{ $t('parachains-page.bids-list.bids-header') }}
      </h1>
      <template v-if="collectedWinningData?.length || loans?.length">
        <h4>
          {{ $t('parachains-page.bids-list.para-id-header') }}
        </h4>
        <h4>
          {{ $t('parachains-page.bids-list.bidder-header') }}
        </h4>
        <h4>
          {{ $t('parachains-page.bids-list.crowdloan-header') }}
        </h4>
        <h4>
          {{ $t('parachains-page.bids-list.leases-header') }}
        </h4>
        <h4>
          {{ $t('parachains-page.bids-list.value-header') }}
        </h4>
      </template>
    </div>
    <template v-if="isLoaded">
      <template v-if="collectedWinningData?.length || loans?.length">
        <div class="bids-list__body">
          <bids-row
            v-for="(item, index) in collectedWinningData"
            :key="index"
            class="bids-list__row"
            :auction-info="auctionInfo"
            :block-number="item.blockNumber"
            :winners-with-loans="item.winnersWithLoans"
            :is-latest="item.isLatest"
          />
        </div>
      </template>
      <template v-else>
        <no-data-message
          class="bids-list__no-data"
          :message="$t('parachains-page.bids-list.no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>
  </div>
</template>

<script>
import BidsRow from '@parachains-page/tabs/auctions/BidsRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { useLeaseRangeMax } from '@parachains-page/composables/useLeaseRanges'
import { api } from '@api'
import { AuctionInfoRecord } from '@/js/records/auction-info.record'

export default {
  name: 'bids-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
    BidsRow,
  },

  props: {
    winningData: { type: Array, default: null },
    auctionInfo: { type: AuctionInfoRecord, default: null },
    funds: { type: Array, default: null },
  },

  setup (props) {
    const rangeMax = useLeaseRangeMax()
    const newRaise = useCall(api.query.crowdloan.newRaise)

    const loans = computed(() => {
      if (newRaise.value && props.auctionInfo?.leasePeriod && props.funds) {
        const leasePeriodStart = props.auctionInfo.leasePeriod
        const leasePeriodEnd = leasePeriodStart.add(rangeMax.value)

        return props.funds
          .filter(({ firstSlot, isWinner, lastSlot, paraId }) =>
            !isWinner &&
            newRaise.value.some((n) => n.eq(paraId)) &&
            firstSlot.gte(leasePeriodStart) &&
            lastSlot.lte(leasePeriodEnd),
          )
          .sort((a, b) => b.value.cmp(a.value))
      } else {
        return null
      }
    })

    const isLoaded = computed(() =>
      newRaise.value && props.winningData && props.auctionInfo?.numAuctions,
    )

    const collectedWinningData = computed(() => {
      if (!isLoaded.value) return null

      if (props.winningData.length) {
        return props.winningData.map(({ blockNumber, winners }, index) => ({
          isLatest: index === 0,
          blockNumber: blockNumber,
          winnersWithLoans: interleave(
            loans.value,
            index !== 0 || props.winningData.length !== 1,
            winners,
          ),
        }))
      } else if (loans.value) {
        return [{
          isLatest: true,
          blockNumber: null,
          winnersWithLoans: interleave(loans.value, false),
        }]
      } else {
        return []
      }
    })

    function interleave (loans, asIs, winners = []) {
      if (asIs || !newRaise.value) return winners

      const filteredLoans = loans
        .filter(({ firstSlot, lastSlot, paraId, value }) => {
          const isEqualsWinners = winners.some((w) =>
            w.firstSlot.eq(firstSlot) && w.lastSlot.eq(lastSlot),
          )

          const isEqualsLoans = loans.value.some((e) =>
            !paraId.eq(e.paraId) &&
            firstSlot.eq(e.firstSlot) &&
            lastSlot.eq(e.lastSlot) &&
            value.lt(e.value),
          )

          return !isEqualsWinners && !isEqualsLoans
        })

      return winners
        .concat(...filteredLoans)
        .map((w) => {
          const loan = loans.value.find(({ firstSlot, lastSlot, value }) =>
            w.firstSlot.eq(firstSlot) &&
            w.lastSlot.eq(lastSlot) &&
            w.value.lt(value),
          )

          return loan || w
        })
        .sort((a, b) =>
          a.firstSlot.eq(b.firstSlot)
            ? a.lastSlot.cmp(b.lastSlot)
            : a.firstSlot.cmp(b.firstSlot),
        )
    }

    return {
      isLoaded,
      collectedWinningData,
      loans,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bids-list {
  overflow-x: auto;

  @include scrollbar;
}

.bids-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}

.bids-list__headers-wrap {
  margin-bottom: 2rem;

  @include action-bid-grid-row(flex-end, 1rem);
}

</style>
