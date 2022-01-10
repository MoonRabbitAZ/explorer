<template>
  <div class="bounties-summary">
    <div class="bounties-summary__content">
      <info-block
        :title="$t('bounties-page.bounties-summary.active-header')"
        :value="bounties?.length"
      />

      <info-block
        :title="$t('bounties-page.bounties-summary.past-header')"
        :value="pastBounties"
      />

      <info-block
        class="bounties-summary__active-total"
        :title="$t('bounties-page.bounties-summary.active-total-header')"
        :value="$fbalance(totalValue)"
        :tooltip="$fFullBalance(totalValue)"
      />

      <progress-info-block
        v-if="spendPeriod?.gtn(0)"
        class="bounties-summary__funding-period"
        :title="$t('bounties-page.bounties-summary.funding-period-header')"
        :current="currentPeriod"
        :total="spendPeriod"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressInfoBlock from '@/vue/common/ProgressInfoBlock'

import { computed } from 'vue'
import { useCall, useTreasury } from '@/vue/composables'
import { api } from '@api'
import { BN } from '@polkadot/util'

export default {
  name: 'bounties-summary',

  components: { InfoBlock, ProgressInfoBlock },

  props: {
    bounties: { type: Array, default: null },
  },

  setup (props) {
    const { spendPeriod } = useTreasury()
    const bestNumber = useCall(api.derive.chain.bestNumber)
    const bountyIndex =
      useCall((api.query.bounties || api.query.treasury).bountyCount)

    const pastBounties = computed(() => {
      if (!props.bounties) return
      return bountyIndex.value?.subn(props.bounties.length).toString()
    })

    const totalValue = computed(() =>
      props.bounties?.reduce((total, { bounty: { value } }) =>
        total.iadd(value),
      new BN(0),
      ),
    )

    const currentPeriod = computed(() => {
      if (!bestNumber.value || !spendPeriod.value?.gtn(0)) return null
      return bestNumber.value.mod(spendPeriod.value)
    })

    return {
      bestNumber,
      pastBounties,
      totalValue,
      spendPeriod,
      currentPeriod,
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
