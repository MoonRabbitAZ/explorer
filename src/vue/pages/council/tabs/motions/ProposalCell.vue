<template>
  <div class="proposal-cell">
    <call-expander
      :extrinsic="proposal"
      :with-hash="!isExternal && !isTreasury"
      :is-full-width-header="false"
    >
      <template v-if="proposal?.args">
        <template v-if="isExternal">
          <external-cell
            :hash="proposal.args[0]"
          />
        </template>

        <template v-if="isTreasury">
          <treasury-cell
            :treasury-proposal="proposal.args[0]"
          />
        </template>
      </template>
    </call-expander>
  </div>
</template>

<script>
import CallExpander from '@/vue/common/CallExpander'
import ExternalCell from '@council-page/tabs/motions/ExternalCell'
import TreasuryCell from '@council-page/tabs/motions/TreasuryCell'

const METHOD_EXTE = ['externalPropose', 'externalProposeDefault', 'externalProposeMajority', 'fastTrack']
const METHOD_TREA = ['approveProposal', 'rejectProposal']

export default {
  name: 'proposal-cell',

  components: {
    CallExpander,
    ExternalCell,
    TreasuryCell,
  },

  props: {
    imageHash: { type: Uint8Array, required: true },
    proposal: { type: Object, required: true },
  },

  setup (props) {
    const { method, section } = props.proposal.registry
      .findMetaCall(props.proposal.callIndex)

    const isTreasury = section === 'treasury' && METHOD_TREA.includes(method)
    const isExternal = section === 'democracy' && METHOD_EXTE.includes(method)
    return {
      isTreasury,
      isExternal,
    }
  },
}
</script>
