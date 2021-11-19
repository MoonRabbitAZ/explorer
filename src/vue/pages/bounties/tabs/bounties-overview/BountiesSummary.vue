<template>
  <div class="bounties-summary">
    <div class="bounties-summary__content">
      <info-block
        :title="$t('bounties-page.bounties-summary.active-header')"
        value="0"
      />

      <info-block
        :title="$t('bounties-page.bounties-summary.past-header')"
        :value="'0'"
      />

      <info-block
        v-tooltip="$fFullBalance('0')"
        class="bounties-summary__active-total"
        :title="$t('bounties-page.bounties-summary.active-total-header')"
        :value="$fbalance('0')"
      />

      <info-block
        class="bounties-summary__funding-period"
        :title="$t('bounties-page.bounties-summary.funding-period-header')"
        value="6days"
        secondary-value="5days 17hrs"
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

const HURDCODE_CURRENT_PROGRESS = new BN(4)
const HURDCODE_TOTAL_PROGRESS = new BN(100)

export default {
  name: 'bounties-summary',

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

.bounties-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(4, min-content);

  @include respond-to($tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.bounties-summary__active-total,
.bounties-summary__funding-period {
  @include respond-to($x-small) {
    grid-column: 1/-1;
  }
}
</style>
