<template>
  <div class="fund-row">
    <p class="fund-row__column fund-row__para-id">
      {{ $fnumber(fund.paraId) }}
    </p>
    <p>
      {{ fundStatus }}
    </p>
    <account-address
      :account-address="fund.info.depositor.toString()"
    />
    <app-button
      scheme="secondary"
      mdi-icon-name="mdi-information-outline"
      @click="openFundInfo"
    />
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { toRefs } from 'vue'
import { BN } from '@polkadot/util'
import { useFundInfo } from '@parachains-page/composables/useFundInfo'

const EVENTS = {
  openFundInfo: 'open-fund-info',
}

export default {
  name: 'fund-row',

  components: {
    AccountAddress,
  },

  props: {
    fund: { type: Object, required: true },
    bestNumber: { type: BN, default: null },
    isOngoing: { type: Boolean, default: false },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { fund, bestNumber, isOngoing } = toRefs(props)

    const { fundStatus } = useFundInfo(
      fund,
      bestNumber,
      isOngoing.value,
    )

    function openFundInfo () {
      emit(EVENTS.openFundInfo, props.fund.paraId)
    }

    return {
      fundStatus,
      openFundInfo,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.fund-row {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 15rem 12rem minmax(15rem, 1fr) 4.4rem;
  align-items: center;
  padding: 1rem 1.6rem;
  min-width: min-content;

  @include content-block;
}

.fund-row__para-id {
  font-size: 1.6rem;
  color: $col-app-accent;
}

.fund-row__column {
  overflow: hidden;
  text-overflow: ellipsis;

  &--double-value {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

</style>
