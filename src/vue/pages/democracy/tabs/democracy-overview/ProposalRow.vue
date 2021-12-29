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
    <p>
      {{ $fbalance(proposal.balance) }}
    </p>
  </div>
</template>

<script>
import ProposalCell from '@council-page/tabs/motions/ProposalCell'

const EVENTS = {
  openVotes: 'open-votes',
}

export default {
  name: 'proposal-row',

  components: { ProposalCell },

  props: {
    proposal: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),
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
</style>
