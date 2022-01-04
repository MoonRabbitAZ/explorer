<template>
  <div class="treasury-summary">
    <div class="treasury-summary__content">
      <info-block
        :title="$t('treasury-page.treasury-summary.proposals-header')"
        :value="$fnumber(proposalCount)"
      />

      <info-block
        :title="$t('treasury-page.treasury-summary.total-header')"
        :value="$fnumber(totalProposals)"
      />

      <info-block
        :title="$t('treasury-page.treasury-summary.approved-header')"
        :value="$fnumber(approvalCount)"
      />

      <info-block
        class="treasury-summary__available"
        :title="$t('treasury-page.treasury-summary.available-header')"
        :value="$fbalance(freeBalance)"
      />

      <info-block
        class="treasury-summary__next-burn"
        :title="$t('treasury-page.treasury-summary.next-burn-header')"
        :value="$fbalance(burn)"
      />

      <template v-if="currentPeriod">
        <progress-info-block
          class="treasury-summary__launch-period"
          :title="$t('treasury-page.treasury-summary.spend-period-header')"
          :current="currentPeriod"
          :total="spendPeriod"
        />
      </template>
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressInfoBlock from '@/vue/common/ProgressInfoBlock'

import { computed } from 'vue'
import { useCall, useTreasury } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'treasury-summary',

  components: { InfoBlock, ProgressInfoBlock },

  props: {
    approvalCount: { type: Number, default: null },
    proposalCount: { type: Number, default: null },
  },

  setup () {
    const { burn, spendPeriod, freeBalance } = useTreasury()
    const totalProposals = useCall(api.query.treasury.proposalCount)
    const bestNumber = useCall(api.derive.chain.bestNumber)

    const currentPeriod = computed(() => {
      if (!bestNumber.value || !spendPeriod.value?.gtn(0)) return null
      return bestNumber.value.mod(spendPeriod.value)
    })

    return {
      totalProposals,
      burn,
      spendPeriod,
      freeBalance,
      currentPeriod,
      bestNumber,
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
