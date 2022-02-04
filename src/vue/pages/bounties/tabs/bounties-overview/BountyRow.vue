<template>
  <div class="bounty-row">
    <p class="bounty-row__index">
      {{ $fnumber(index) }}
    </p>
    <account-address
      :account-address="bounty.proposer.toString()"
    />
    <p>
      {{ bountyState?.bountyStatus }}
    </p>
    <p>
      <span v-tooltip="$fFullBalance(bounty.value)">
        {{ $fbalance(bounty.value) }}
      </span>
    </p>
    <div>
      <template v-if="blockNextAction">
        <p class="bounty-row__time">
          {{ nextActionTime }}
        </p>
        <p>
          {{ `#${blockNextAction}` }}
        </p>
      </template>
    </div>
    <div>
      <app-button
        mdi-icon-name="mdi-information-outline"
        scheme="secondary"
        @click="openInfo"
      />
    </div>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { computed } from 'vue'
import { useBounty } from '@bounties-page/composables/useBounty'
import { BN } from '@polkadot/util'

const EVENTS = {
  openInfo: 'open-info',
}

export default {
  name: 'bounty-row',

  components: {
    AccountAddress,
  },

  props: {
    /** @type {import('@polkadot/types/interfaces').Bounty}  */
    bounty: { type: Object, required: true },
    index: { type: BN, required: true },
    bestNumber: { type: BN, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const bountyStatus = computed(() => props.bounty.status)
    const bestNumber = computed(() => props.bestNumber)
    const {
      bountyState,
      nextActionTime,
      blockNextAction,
    } = useBounty(bountyStatus, bestNumber)

    function openInfo () {
      emit(EVENTS.openInfo, props.index.toString())
    }

    return {
      bountyState,
      nextActionTime,
      blockNextAction,
      openInfo,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bounty-row {
  @include bounty-grid-row(center, 1rem);
  @include content-block;
}

.bounty-row__index {
  font-size: 1.6rem;
}

.bounty-row__time {
  margin-bottom: 1rem;
}
</style>
