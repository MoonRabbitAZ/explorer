<template>
  <div class="bids-list">
    <h1 class="bids-list__header">
      {{ $t('parachains-page.bids-list.bids-header') }}
    </h1>
    <template v-if="isLoaded">
      <template v-if="collectedWinningData.length">
        <div class="bids-list__body">
          <bids-row
            v-for="(item, index) in collectedWinningData"
            :key="index"
            :auction-info="auctionInfo"
            :block-number="item.blockNumber"
            :winners-with-loans="item.winnersWithLoans"
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
      props.auctionInfo?.leasePeriod &&
        props.winningData &&
        loans.value,
    )

    const collectedWinningData = computed(() => {
      if (!isLoaded.value) return null

      if (props.winningData.length) {
        return props.winningData.map(({ blockNumber, winners }, index) => ({
          blockNumber: blockNumber,
          winnersWithLoans: interleave(
            loans.value,
            index !== 0 || props.winningData.length !== 1,
            winners,
          ),
        }))
      } else if (loans.value) {
        return [{
          blockNumber: null,
          winnersWithLoans: interleave(loans.value, false),
        }]
      } else {
        return []
      }
    })

    function interleave (loans, asIs, winners = []) {
      if (asIs || !newRaise.value) return winners

      return winners
        .concat(...loans
          .filter(({ firstSlot, lastSlot, paraId, value }) =>
            !winners.some((w) =>
              w.firstSlot.eq(firstSlot) && w.lastSlot.eq(lastSlot),
            ) &&
          !loans.value.some((e) =>
            !paraId.eq(e.paraId) &&
            firstSlot.eq(e.firstSlot) &&
            lastSlot.eq(e.lastSlot) &&
            value.lt(e.value),
          ),
          ))
        .map((w) =>
          loans.value.find(({ firstSlot, lastSlot, value }) =>
            w.firstSlot.eq(firstSlot) &&
            w.lastSlot.eq(lastSlot) &&
            w.value.lt(value),
          ) || w,
        )
        .sort((a, b) =>
          a.firstSlot.eq(b.firstSlot)
            ? a.lastSlot.cmp(b.lastSlot)
            : a.firstSlot.cmp(b.firstSlot),
        )
    }

    return {
      isLoaded,
      collectedWinningData,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bids-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
