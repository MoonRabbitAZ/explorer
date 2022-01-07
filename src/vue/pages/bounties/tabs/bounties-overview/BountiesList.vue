<template>
  <div class="bounties-list">
    <h1 class="bounties-list__header">
      {{ $t('bounties-page.bounties-list.bounties-header') }}
    </h1>
    <template v-if="bounties && bestNumber">
      <template v-if="bounties.length">
        <bounty-row
          v-for="(item, index) in bounties"
          :key="index"
          :bounty="item.bounty"
          :index="item.index"
          :best-number="bestNumber"
        />
      </template>
      <template v-else>
        <no-data-message
          class="bounties-list__no-data"
          :message="$t('bounties-page.bounties-list.no-data-message')"
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
import BountyRow from '@bounties-page/tabs/bounties-overview/BountyRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'bounties-list',

  components: {
    BountyRow,
    SkeletonLoader,
    NoDataMessage,
  },

  props: {
    bounties: { type: Array, default: null },
  },

  setup () {
    const bestNumber = useCall(api.derive.chain.bestNumber)

    return { bestNumber }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bounties-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
