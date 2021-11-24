<template>
  <div class="bids-row">
    <template
      v-for="(item, index) in winnersWithLoans"
      :key="index"
    >
      <p class="bids-row__block-number">
        <template v-if="index === 0">
          {{ blockNumberOrLatest }}
        </template>
      </p>
      <p class="bids-row__para-id">
        {{ $fnumber(item.paraId) }}
      </p>
      <account-address :account-address="item.accountId"/>
      <p>
        {{ item.isCrowdloan
          ? $t('parachains-page.bids-row.is-crowdloan')
          : $t('parachains-page.bids-row.is-not-crowdloan')
        }}
      </p>
      <p>
        {{
          item.firstSlot.eq(item.lastSlot)
            ? $fnumber(item.firstSlot)
            : `${$fnumber(item.firstSlot)} - ${$fnumber(item.lastSlot)}`
        }}
      </p>
      <p>
        <span v-tooltip="$fFullBalance(item.value)">
          {{ $fbalance(item.value) }}
        </span>
      </p>
    </template>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { computed } from 'vue'
import { BN, formatNumber } from '@polkadot/util'
import { useI18n } from 'vue-i18n'
import { AuctionInfoRecord } from '@/js/records/auction-info.record'

export default {
  name: 'bids-list',

  components: { AccountAddress },

  props: {
    winnersWithLoans: { type: Array, required: true },
    auctionInfo: { type: AuctionInfoRecord, required: true },
    isLatest: { type: Boolean, required: true },
    blockNumber: { type: BN, required: true },
  },

  setup (props) {
    const { t } = useI18n()

    const blockNumberOrLatest = computed(() => {
      const blockNum = (!props.blockNumber || props.blockNumber.isZero())
        ? props.auctionInfo.endBlock
        : props.blockNumber
      return props.isLatest
        ? t('parachains-page.bids-row.latest-bid')
        : '#' + formatNumber(blockNum)
    })

    return { blockNumberOrLatest }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bids-row {
  @include action-bid-grid-row(center, 1rem);
  @include content-block;
}

.bids-row__block-number,
.bids-row__para-id {
  font-size: 1.6rem;
}
</style>
