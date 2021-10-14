<template>
  <div class="treasury-summary">
    <div class="treasury-summary__content">
      <info-block
        :title="$t('treasury-page.treasury-summary.proposals-header')"
        value="0"
      />

      <info-block
        :title="$t('treasury-page.treasury-summary.total-header')"
        value="0"
      />

      <info-block
        :title="$t('treasury-page.treasury-summary.approved-header')"
        value="0"
      />

      <info-block
        class="treasury-summary__available"
        :title="$t('treasury-page.treasury-summary.available-header')"
        :value="$fbalance(HURDCODE_AVAILABLE_UNIT)"
      />

      <info-block
        class="treasury-summary__next-burn"
        :title="$t('treasury-page.treasury-summary.next-burn-header')"
        :value="$fbalance(HURDCODE_NEXT_BURN_UNIT)"
      />

      <info-block
        class="treasury-summary__launch-period"
        :title="$t('treasury-page.treasury-summary.spend-period-header')"
        value="6d"
        secondary-value="5d 18h"
      >
        <template #additional>
          <progress-bar
            :current="HURDCODE_CURRENT_PROGRESS"
            :total="HURDCODE_TOTAL_PROGRESS"
          />
        </template>
      </info-block>
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressBar from '@/vue/common/ProgressBar'
import { BN } from '@polkadot/util'

const HURDCODE_CURRENT_PROGRESS = new BN(3)
const HURDCODE_TOTAL_PROGRESS = new BN(100)
const HURDCODE_AVAILABLE_UNIT = '429413700000000000000'
const HURDCODE_NEXT_BURN_UNIT = '858827000000000000'

export default {
  name: 'treasury-summary',

  components: { InfoBlock, ProgressBar },

  setup () {
    return {
      HURDCODE_CURRENT_PROGRESS,
      HURDCODE_TOTAL_PROGRESS,
      HURDCODE_AVAILABLE_UNIT,
      HURDCODE_NEXT_BURN_UNIT,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.treasury-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(6, min-content);
  justify-content: center;

  @include respond-to($x-medium) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.treasury-summary__available,
.treasury-summary__next-burn,
.treasury-summary__launch-period {
  @include respond-to($x-small) {
    grid-column: 1/-1;
  }
}
</style>
