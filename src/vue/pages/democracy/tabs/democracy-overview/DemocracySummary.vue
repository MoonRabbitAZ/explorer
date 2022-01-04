<template>
  <div class="democracy-summary">
    <div class="democracy-summary__content">
      <info-block
        :title="$t('democracy-page.democracy-summary.proposals-header')"
        :value="$fnumber(activeProposals?.length)"
      />

      <info-block
        :title="$t('democracy-page.democracy-summary.total-header')"
        :value="$fnumber(publicPropCount)"
      />

      <info-block
        :title="$t('democracy-page.democracy-summary.referenda-header')"
        :value="$fnumber(referendumCount)"
      />

      <info-block
        :title="$t('democracy-page.democracy-summary.total-header')"
        :value="$fnumber(referendumTotal)"
      />

      <progress-info-block
        class="democracy-summary__launch-period"
        :title="$t('democracy-page.democracy-summary.launch-period-header')"
        :total="launchPeriod"
        :current="progressLaunchPeriod"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressInfoBlock from '@/vue/common/ProgressInfoBlock'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { BN_ONE } from '@polkadot/util'

export default {
  name: 'democracy-summary',

  components: { InfoBlock, ProgressInfoBlock },

  props: {
    referendumCount: { type: Number, default: 0 },
  },

  setup () {
    const activeProposals = useCall(api.derive.democracy.proposals)
    const publicPropCount = useCall(api.query.democracy.publicPropCount)
    const referendumTotal = useCall(api.query.democracy.referendumCount)
    const bestNumber = useCall(api.derive.chain.bestNumber)
    const launchPeriod = api.consts.democracy.launchPeriod

    const progressLaunchPeriod = computed(() =>
      bestNumber.value && launchPeriod
        ? bestNumber.value.mod(launchPeriod).iadd(BN_ONE)
        : null,
    )

    return {
      activeProposals,
      publicPropCount,
      referendumTotal,
      launchPeriod,
      progressLaunchPeriod,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.democracy-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(5, min-content);
  justify-content: center;

  @include respond-to($media-small-desktop) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.democracy-summary__launch-period {
  @include respond-to($tablet) {
    grid-column: 1/-1;
  }
}
</style>
