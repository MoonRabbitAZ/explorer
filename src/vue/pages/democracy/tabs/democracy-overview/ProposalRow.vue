<template>
  <div class="proposal-row">
    <p class="proposal-row__index">
      {{ $fnumber(proposal.index) }}
    </p>
    <div>
      <proposal-cell
        class="proposal-row__proposals"
        :image-hash="proposal.imageHash"
        :proposal="proposal.image?.proposal"
      />
    </div>
    <div>
      <account-address
        :account-address="proposal.proposer.toString()"
      />
    </div>
    <p>
      {{ $fbalance(proposal.balance) }}
    </p>
    <p>
      {{ $fnumber(secondsCount) }}
    </p>
    <div class="proposal-row__actions">
      <app-button
        scheme="secondary"
        :text="$t('democracy-page.proposal-row.seconding-btn')"
        @click="openSeconding"
      />
    </div>
  </div>
</template>

<script>
import ProposalCell from '@council-page/tabs/motions/ProposalCell'
import AccountAddress from '@/vue/common/AccountAddress'

import { computed } from 'vue'

const EVENTS = {
  openSeconding: 'open-seconding',
}

export default {
  name: 'proposal-row',

  components: { ProposalCell, AccountAddress },

  props: {
    proposal: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const secondsCount = computed(() =>
      props.proposal.seconds.length
        ? props.proposal.seconds.length - 1
        : 0,
    )

    function openSeconding () {
      emit(EVENTS.openSeconding, props.proposal.index.toString())
    }

    return { secondsCount, openSeconding }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.proposal-row {
  min-width: min-content;

  @include democracy-proposal-grid-row(center, 1rem);
  @include content-block;
}

.proposal-row__index {
  font-size: 1.6rem;
}

.proposal-row__actions {
  justify-self: flex-end;
}
</style>
