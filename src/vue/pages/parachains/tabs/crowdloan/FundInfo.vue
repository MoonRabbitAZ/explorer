<template>
  <div class="fund-info">
    <div class="fund-info__body">
      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.para-id-header')"
        :value="$fnumber(fund.paraId)"
      />

      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.status-header')"
        :value="fundStatus"
      />

      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.leases-header')"
        :value="blocksLeftTime"
      >
        <p class="fund-info__value">
          {{ $fnumber(fund.info.end) }}
        </p>
        <p class="fund-info__value">
          {{ blocksLeftTime }}
        </p>
      </value-displayer>
    </div>
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'

import { BN } from '@polkadot/util'
import { useFundInfo } from '@parachains-page/composables/useFundInfo'

export default {
  name: 'fund-info',

  components: { ValueDisplayer },

  props: {
    fund: { type: Object, required: true },
    bestNumber: { type: BN, default: null },
  },

  setup (props) {
    const {
      fundStatus,
      period,
      blocksLeftTime,
      blocksLeft,
    } = useFundInfo(props.fund, props.bestNumber)

    return {
      fundStatus,
      period,
      blocksLeftTime,
      blocksLeft,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.fund-info__body {
  padding: 0 $drawer-padding;
}

.fund-info__value-displayer {
  & + & {
    margin-top: 3rem;
  }
}

.fund-info__value {
  font-size: inherit;

  & + & {
    margin-top: 1rem;
  }
}

</style>
