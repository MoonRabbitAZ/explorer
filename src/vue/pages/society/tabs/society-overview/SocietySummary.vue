<template>
  <div class="society-summary">
    <div class="society-summary__content">
      <info-block
        :title="$t('society-page.society-summary.members-header')"
        value="0/0"
      />

      <info-block
        :title="$t('society-page.society-summary.rotation-header')"
        value="7days"
        secondary-value="6days 9hrs"
      >
        <template #additional>
          <progress-bar
            :current="HURDCODE_CURRENT_PROGRESS"
            :total="HURDCODE_TOTAL_PROGRESS"
          />
        </template>
      </info-block>

      <info-block
        :title="$t('society-page.society-summary.challenge-header')"
        value="7days"
        secondary-value="6days 9hrs"
      >
        <template #additional>
          <progress-bar
            :current="HURDCODE_CURRENT_PROGRESS"
            :total="HURDCODE_TOTAL_PROGRESS"
          />
        </template>
      </info-block>
      <info-block
        v-tooltip="$fFullBalance('0')"
        :title="$t('society-page.society-summary.payouts-header')"
        :value="$fbalance('0')"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressBar from '@/vue/common/ProgressBar'
import { BN } from '@polkadot/util'

const HURDCODE_CURRENT_PROGRESS = new BN(8)
const HURDCODE_TOTAL_PROGRESS = new BN(100)
export default {
  name: 'society-summary',

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

.society-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(4, min-content);
  justify-content: center;

  @include respond-to($tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include respond-to($x-small) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
