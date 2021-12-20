<template>
  <div class="auctions-summary">
    <div class="auctions-summary__content">
      <info-block
        class="auctions-summary__info-block"
        :title="$t('parachains-page.auctions-summary.auctions-header')"
        :value="auctionInfo?.numAuctions.toString()"
      />
      <info-block
        class="auctions-summary__info-block"
        :title="$t('parachains-page.auctions-summary.active-header')"
        :value="auctionActiveStatus"
      />

      <template v-if="auctionInfo?.leasePeriod">
        <info-block
          class="auctions-summary__info-block"
          :title="$t('parachains-page.auctions-summary.first-last-header')"
          :value="leasePeriod"
        />
      </template>

      <template v-if="auctionInfo?.endBlock">
        <info-block
          v-if="isHaveWinners"
          class="auctions-summary__info-block"
          v-tooltip="$fFullBalance(lastWinnersTotalBalance)"
          :title="$t('parachains-page.auctions-summary.total-header')"
          :value="$fbalance(lastWinnersTotalBalance)"
        >
          <template #additional>
            <progress-bar
              :current="lastWinnersTotalBalance"
              :total="totalIssuance"
            />
          </template>
        </info-block>

        <info-block
          class="auctions-summary__info-block"
          :title="endPeriodHeader"
          :value="endPeriod.total"
          :secondary-value="endPeriod.progress"
        >
          <template v-if="isEndingPeriod" #additional>
            <progress-bar
              :current="progressPeriod"
              :total="endingPeriod"
            />
          </template>
        </info-block>
      </template>
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressBar from '@/vue/common/ProgressBar'

import { computed } from 'vue'
import { useCall, useBlockTime } from '@/vue/composables'
import { useI18n } from 'vue-i18n'
import { api } from '@api'
import { BN, BN_ONE, formatNumber } from '@polkadot/util'
import { AuctionInfoRecord } from '@/js/records/auction-info.record'

export default {
  name: 'auctions-summary',

  components: { InfoBlock, ProgressBar },

  props: {
    auctionInfo: { type: AuctionInfoRecord, default: null },
    lastWinnersTotalBalance: { type: BN, default: null },
    isHaveWinners: { type: Boolean, required: true },
  },

  setup (props) {
    const { t } = useI18n()
    const bestNumber = useCall(api.derive.chain.bestNumber)
    const totalIssuance = useCall(api.query.balances?.totalIssuance)
    const endingPeriod = api.consts.auctions?.endingPeriod
    const { calculateTimeStr } = useBlockTime()

    const auctionActiveStatus = computed(() => {
      if (!props.auctionInfo) return
      return props.auctionInfo?.leasePeriod
        ? t('parachains-page.auctions-summary.auctions-active-value')
        : t('parachains-page.auctions-summary.auctions-inactive-value')
    })

    const leasePeriod = computed(() => {
      if (!props.auctionInfo?.leasePeriod) return
      const entPeriod = props.auctionInfo.leasePeriod
        .add(api.consts.auctions.leasePeriodsPerSlot)
        .isub(BN_ONE)
      return `${props.auctionInfo.leasePeriod} - ${entPeriod}`
    })

    const isEndingPeriod = computed(() => {
      if (!bestNumber.value || !props.auctionInfo?.endBlock) return
      return props.auctionInfo.endBlock.lt(bestNumber.value)
    })

    const endPeriodHeader = computed(() =>
      isEndingPeriod.value
        ? t('parachains-page.auctions-summary.ending-period-header')
        : t('parachains-page.auctions-summary.end-period-at-header'),
    )

    const progressPeriod = computed(() => {
      if (!bestNumber.value || !props.auctionInfo?.endBlock) return
      return bestNumber.value.sub(props.auctionInfo.endBlock)
    })

    const endPeriod = computed(() => {
      if (progressPeriod.value) {
        return isEndingPeriod.value
          ? {
              total: calculateTimeStr(endingPeriod),
              progress:
                calculateTimeStr(endingPeriod.sub(progressPeriod.value), true),
            }
          : {
              total: `#${formatNumber(props.auctionInfo.endBlock)}`,
              progress: calculateTimeStr(bestNumber.value, true),
            }
      } else {
        return {
          total: null,
          progress: null,
        }
      }
    })

    return {
      auctionActiveStatus,
      leasePeriod,
      totalIssuance,
      isEndingPeriod,
      bestNumber,
      endPeriodHeader,
      progressPeriod,
      endingPeriod,
      endPeriod,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.auctions-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(5, min-content);

  @include respond-to($medium) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.auctions-summary__info-block:nth-child(1n + 3) {
  @include respond-to($small) {
    grid-column: 1/-1;
  }
}
</style>
