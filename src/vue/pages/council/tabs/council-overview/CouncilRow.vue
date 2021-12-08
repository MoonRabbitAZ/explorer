<template>
  <div class="council-row">
    <div class="council-row__account">
      <account-address :account-address="accountId" />
      <template v-if="isPrime">
        <icon
          v-tooltip="$t('council-page.council-row.prime-voter')"
          class="council-row__prime-icon"
          name="crown"
        />
      </template>
    </div>
    <p class="council-row__balance">
      <span v-tooltip="$fFullBalance(balance)">
        {{ $fbalance(balance) }}
      </span>
    </p>
    <p class="council-row__votes">
      {{ $fnumber(votesCount) }}
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
import Icon from '@/vue/common/Icon'

import { BN } from '@polkadot/util'

const EVENTS = {
  openInfo: 'open-info',
}

export default {
  name: 'council-row',

  components: {
    AccountAddress,
    Icon,
  },

  props: {
    accountId: { type: String, required: true },
    balance: { type: BN, default: null },
    isPrime: { type: Boolean, default: false },
    votesCount: { type: Number, default: 0 },
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
  @include councils-grid-row(center, 1rem);
  @include content-block;
}

.council-row__account {
  display: flex;
  align-items: center;
}

.council-row__prime-icon {
  width: 2.4rem;
  height: 2.4rem;
  min-width: 2.4rem;
  margin-left: 2rem;
}
</style>
