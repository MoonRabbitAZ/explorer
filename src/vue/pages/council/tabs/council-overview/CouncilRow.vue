<template>
  <div class="council-row">
    <div>
      <account-address
        :account-address="accountId"
      />
    </div>
    <p>
      <span v-tooltip="$fFullBalance(balance)">
        {{ $fbalance(balance) }}
      </span>
    </p>
    <p>
      {{ $fnumber(votersCount) }}
    </p>
    <div>
      <app-button
        scheme="secondary"
        mdi-icon-name="mdi-information-outline"
        @click="openInfo"
      />
    </div>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { BN } from '@polkadot/util'

const EVENTS = {
  openInfo: 'open-info',
}

export default {
  name: 'council-row',

  components: {
    AccountAddress,
  },

  props: {
    accountId: { type: String, required: true },
    balance: { type: BN, default: null },
    isPrime: { type: Boolean, default: false },
    votersCount: { type: Number, default: 0 },
    electionsListType: { type: String, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    function openInfo () {
      emit(EVENTS.openInfo, props.accountId)
    }

    return {
      openInfo,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.council-row {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: minmax(15rem, 1fr) 10rem 5rem 4.4rem;
  align-items: center;
  padding: 1rem 1.6rem;

  @include content-block;
}
</style>
