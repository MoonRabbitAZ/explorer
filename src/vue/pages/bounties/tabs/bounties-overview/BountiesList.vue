<template>
  <div class="bounties-list">
    <div
      class="bounties-list__headers"
      :class="{'bounties-list__headers--grid': bounties && bestNumber}"
    >
      <h1>
        {{ $t('bounties-page.bounties-list.bounties-header') }}
      </h1>
      <template v-if="bounties && bestNumber">
        <h4>
          {{ $t('bounties-page.bounties-list.proposer-header') }}
        </h4>
        <h4>
          {{ $t('bounties-page.bounties-list.status-header') }}
        </h4>
        <h4>
          {{ $t('bounties-page.bounties-list.value-header') }}
        </h4>
        <h4>
          {{ $t('bounties-page.bounties-list.next-action-header') }}
        </h4>
      </template>
    </div>
    <template v-if="bounties && bestNumber">
      <template v-if="bounties.length">
        <bounty-row
          v-for="(item, index) in bounties"
          :key="index"
          :bounty="item.bounty"
          :index="item.index"
          :best-number="bestNumber"
          @open-info="openInfo"
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

    <drawer
      v-model:is-shown="isInfoDrawerOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('treasury-page.tips-list.tippers-drawer-header') }}
      </template>
      <bounty-info
        :bounty="currentBounty.bounty"
        :index="currentBounty.index"
        :description="currentBounty.description"
        :proposals="currentBounty.proposals"
        :best-number="bestNumber"
      />
    </drawer>
  </div>
</template>

<script>
import BountyRow from '@bounties-page/tabs/bounties-overview/BountyRow'
import BountyInfo from '@bounties-page/tabs/bounties-overview/BountyInfo'
import Drawer from '@/vue/common/Drawer'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { reactive, toRefs, computed, watch } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'bounties-list',

  components: {
    BountyRow,
    BountyInfo,
    Drawer,
    SkeletonLoader,
    NoDataMessage,
  },

  props: {
    bounties: { type: Array, default: null },
  },

  setup (props) {
    const state = reactive({
      isInfoDrawerOpen: false,
      currentBountyIndex: '',
    })
    const bestNumber = useCall(api.derive.chain.bestNumber)

    const currentBounty = computed(() =>
      props.bounties?.find(({ index }) =>
        state.currentBountyIndex === index.toString(),
      ),
    )

    function openInfo (index) {
      state.currentBountyIndex = index
      state.isInfoDrawerOpen = true
    }

    watch(currentBounty, (value) => {
      if (!value) state.isInfoDrawerOpen = false
    })

    return {
      ...toRefs(state),
      bestNumber,
      currentBounty,
      openInfo,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bounties-list {
  overflow-x: auto;

  @include scrollbar;
}

.bounties-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    @include bounty-grid-row(flex-end);
  }
}

</style>
