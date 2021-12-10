<template>
  <div v-if="proposal" class="treasury-cell">
    <div>
      <params :params="paramsWithValues" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { getTypeDef } from '@polkadot/types/create'

export default {
  name: 'treasury-cell',

  props: {
    treasuryProposal: { type: Object, required: true },
  },

  setup (props) {
    const proposalId = computed(() => props.treasuryProposal.unwrap())
    const proposal = useCall(
      api.query.treasury.proposals,
      [proposalId],
      { transform: (optProp) => optProp.unwrapOr(null) },
    )

    const paramsWithValues = computed(() => {
      if (proposal.value) {
        return [{
          param: {
            name: 'proposal',
            type: getTypeDef('TreasuryProposal'),
          },
          value: {
            isValid: true,
            value: proposal,
          },
        }]
      } else {
        return []
      }
    })

    return { paramsWithValues }
  },
}
</script>
