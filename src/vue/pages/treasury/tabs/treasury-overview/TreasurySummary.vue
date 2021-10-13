<template>
  <div class="treasury-summary">
    <div class="treasury-summary__content">
      <info-block
        :title="$t('treasury-page.treasury-summary.proposals-header')"
        value="4"
      />

      <info-block
        :title="$t('treasury-page.treasury-summary.total-header')"
        value="6"
      />

      <info-block
        :title="$t('treasury-page.treasury-summary.approved-header')"
        value="0"
      />

      <info-block
        :title="$t('treasury-page.treasury-summary.available-header')"
        :value="$fbalance('0')"
      />

      <info-block
        :title="$t('treasury-page.treasury-summary.next-burn-header')"
        :value="$fbalance('0')"
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

export default {
  name: 'treasury-summary',

  components: { InfoBlock, ProgressBar },

  setup () {
    return {
      HURDCODE_CURRENT_PROGRESS,
      HURDCODE_TOTAL_PROGRESS,
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

  @include respond-to($medium) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.treasury-summary__launch-period {
  @include respond-to($x-small) {
    grid-column: 1/-1;
  }
}
</style>
