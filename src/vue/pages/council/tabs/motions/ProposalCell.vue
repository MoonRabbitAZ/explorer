<template>
  <div class="proposal-cell">
    <template v-if="proposal">
      <call-expander
        :extrinsic="proposal"
        :with-hash="!isExternal && !isTreasury"
        :is-full-width-header="false"
      >
        <template v-if="proposal.args">
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
    </template>
    <template v-else>
      <p class="proposal-cell__image-hash">
        {{ $t('council-page.proposal-cell.preimage', { hash: imageHash }) }}
      </p>
    </template>
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
    proposal: { type: Object, default: null },
  },

  setup (props) {
    if (!props.proposal) return

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

.proposal-cell__image-hash {
  min-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
