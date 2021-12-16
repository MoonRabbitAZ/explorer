<template>
  <div v-if="proposal" class="external-cell">
    <div class="external-cell__call-expander">
      <call-expander
        :extrinsic="proposal.proposal"
        with-hash
        :is-full-width-header="false"
      />
    </div>
  </div>
</template>

<script>
import CallExpander from '@/vue/common/CallExpander'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'external-cell',

  components: { CallExpander },

  props: {
    hash: { type: Uint8Array, required: true },
  },

  setup (props) {
    const proposal = useCall(
      api.derive.democracy.preimage,
      computed(() => ([props.hash])),
    )

    return { proposal }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.external-cell__call-expander {
  padding: 0 0 0.5rem 3rem;
  border-left: 0.3rem solid $col-app-accent;
  overflow-x: auto;

  @include scrollbar;
}
</style>
