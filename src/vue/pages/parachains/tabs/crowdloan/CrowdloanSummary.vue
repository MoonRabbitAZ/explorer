<template>
  <div class="crowdloan-summary">
    <div class="crowdloan-summary__content">
      <info-block
        :title="$t('parachains-page.crowdloan-summary.founds-header')"
        :value="$fnumber(fundCount)"
      />
      <info-block
        :title="$t('parachains-page.crowdloan-summary.founds-header')"
        :value="$fbalance(activeCap)"
        :secondary-value="$fbalance(activeRaised)"
      >
        <template #additional>
          <progress-bar
            :current="activeRaised"
            :total="activeCap"
          />
        </template>
      </info-block>

      <info-block
        :title="$t('parachains-page.crowdloan-summary.founds-header')"
        :value="$fbalance(totalCap)"
        :secondary-value="$fbalance(totalRaised)"
      >
        <template #additional>
          <progress-bar
            :current="totalRaised"
            :total="totalCap"
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

export default {
  name: 'crowdloan-summary',

  components: { InfoBlock, ProgressBar },

  props: {
    fundCount: { type: Number, required: true },
    activeCap: { type: BN, required: true },
    activeRaised: { type: BN, required: true },
    totalCap: { type: BN, required: true },
    totalRaised: { type: BN, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.crowdloan-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(3, min-content);

  @include respond-to($tablet) {
    grid-template-columns: 1fr;
  }
}
</style>
