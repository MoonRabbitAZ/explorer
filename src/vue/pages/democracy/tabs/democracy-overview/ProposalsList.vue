<template>
  <div class="proposals-list">
    <h1 class="proposals-list__header">
      {{ $t('democracy-page.proposals-list.proposals-header') }}
    </h1>
    <template v-if="proposals">
      <template v-if="proposals.length">
        <proposal-row
          v-for="(proposal, index) in proposals"
          :key="index"
          :proposal="proposal"
        />
      </template>
      <template v-else>
        <no-data-message
          class="proposals-list__no-data"
          :message="$t('democracy-page.proposals-list.no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>
  </div>
</template>

<script>
import ProposalRow from '@democracy-page/tabs/democracy-overview/ProposalRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { useCall } from '@/vue/composables'
import { api } from '@api'
export default {
  name: 'proposals-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
    ProposalRow,
  },

  setup () {
    const proposals = useCall(api.derive.democracy.proposals)

    return {
      proposals,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.proposals-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
