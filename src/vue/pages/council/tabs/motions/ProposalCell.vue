<template>
  <div class="proposal-cell">
    <call-expander
      :extrinsic="proposal"
    >
      <template v-if="isExternal && false">
        <external-cell
          :hash="proposal.args[0]"
        />
      </template>
    </call-expander>
  </div>
</template>

<script>
import CallExpander from '@/vue/common/CallExpander'
import ExternalCell from '@council-page/tabs/motions/ExternalCell'

const METHOD_EXTE = ['externalPropose', 'externalProposeDefault', 'externalProposeMajority', 'fastTrack']
const METHOD_TREA = ['approveProposal', 'rejectProposal']

export default {
  name: 'proposal-cell',

  components: {
    CallExpander,
    ExternalCell,
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

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

</style>
