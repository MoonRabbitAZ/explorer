<template>
  <div class="proposal-row">
    <p class="proposal-row__id">
      {{ $fnumber(proposal.id) }}
    </p>
    <account-address
      :account-address="proposal.proposal.proposer.toString()"
    />
    <account-address
      :account-address="proposal.proposal.beneficiary.toString()"
    />
    <p>
      <span v-tooltip="$fFullBalance(proposal.proposal.value)">
        {{ $fbalance(proposal.proposal.value) }}
      </span>
    </p>
    <p>
      <span v-tooltip="$fFullBalance(proposal.proposal.bond)">
        {{ $fbalance(proposal.proposal.bond) }}
      </span>
    </p>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

export default {
  name: 'proposal-row',

  components: { AccountAddress },

  props: {
    /** @type {import('@polkadot/api-derive/types').DeriveTreasuryProposal}  */
    proposal: { type: Object, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.proposal-row {
  @include treasury-proposal-grid-row(center, 1rem);
  @include content-block;
}

.proposal-row__id {
  font-size: 1.6rem;
}
</style>
