<template>
  <div v-if="proposal" class="treasury-cell">
    <params :params="paramsWithValues" />
  </div>
</template>

<script>
import Params from '@/vue/common/Params'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { getTypeDef } from '@polkadot/types/create'

export default {
  name: 'treasury-cell',

  components: { Params },

  props: {
    treasuryProposal: { type: Object, required: true },
  },

  setup (props) {
    const proposal = useCall(
      api.query.treasury.proposals,
      computed(() => ([props.treasuryProposal.unwrap()])),
      { transform: (optProp) => optProp.unwrapOr(null) },
    )

    const paramsWithValues = computed(() => {
      if (proposal.value) {
        return [{
          param: {
            name: 'proposal',
            type: getTypeDef('TreasuryProposal'),
          },
          value: proposal.value,
        }]
      } else {
        return []
      }
    })

    return { paramsWithValues, proposal }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.treasury-cell {
  padding: 0 0 0.5rem 3rem;
  border-left: 0.3rem solid $col-app-accent;
  overflow-x: auto;

  @include scrollbar;
}
</style>
