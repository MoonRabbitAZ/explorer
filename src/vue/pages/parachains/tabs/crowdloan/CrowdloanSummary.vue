<template>
  <div class="crowdloan-summary">
    <div class="crowdloan-summary__content">
      <info-block
        :title="$t('parachains-page.crowdloan-summary.founds-header')"
        :value="$fnumber(fundCount)"
      />

      <progress-info-block
        :title="$t('parachains-page.crowdloan-summary.raised-founds-title')"
        :current="activeRaised"
        :total="activeCap"
        with-balance
      />

      <progress-info-block
        :title="$t('parachains-page.crowdloan-summary.total-founds-title')"
        :current="totalRaised"
        :total="totalCap"
        with-balance
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressInfoBlock from '@/vue/common/ProgressInfoBlock'

import { BN } from '@polkadot/util'

export default {
  name: 'crowdloan-summary',

  components: { InfoBlock, ProgressInfoBlock },

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
