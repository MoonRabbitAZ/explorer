<template>
  <div class="proposals-list">
    <div
      class="proposals-list__headers"
      :class="{'proposals-list__headers--grid': proposals?.length}"
    >
      <h1>
        {{ $t('democracy-page.proposals-list.proposals-header') }}
      </h1>
      <template v-if="proposals?.length">
        <h4>
          {{ $t('democracy-page.proposals-list.proposer-header') }}
        </h4>
        <h4>
          {{ $t('democracy-page.proposals-list.locked-header') }}
        </h4>
        <h4>
          {{ $t('democracy-page.proposals-list.seconds-header') }}
        </h4>
      </template>
    </div>
    <template v-if="proposals">
      <template v-if="proposals.length">
        <proposal-row
          v-for="(proposal, index) in proposals"
          :key="index"
          class="proposals-list__row"
          :proposal="proposal"
          @open-seconding="openSeconding"
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

    <drawer
      ref="drawer"
      class="proposals-list__votes-drawer"
      v-model:is-shown="isSecondingDrawerOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('democracy-page.proposals-list.drawer-proposal-header', {
          index: currentProposalIndex,
        }) }}
      </template>
      <proposal-seconds
        :proposal="currentProposal"
      />
    </drawer>
  </div>
</template>

<script>
import ProposalRow from '@democracy-page/tabs/democracy-overview/ProposalRow'
import ProposalSeconds from '@democracy-page/tabs/democracy-overview/ProposalSeconds'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Drawer from '@/vue/common/Drawer'

import { reactive, toRefs, computed, watch } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'proposals-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
    ProposalRow,
    Drawer,
    ProposalSeconds,
  },

  setup () {
    const state = reactive({
      currentProposalIndex: '',
      isSecondingDrawerOpen: false,
    })
    const proposals = useCall(api.derive.democracy.proposals)

    const currentProposal = computed(() =>
      proposals.value?.find(({ index }) =>
        state.currentProposalIndex === index.toString()),
    )

    function openSeconding (index) {
      state.currentProposalIndex = index
      state.isSecondingDrawerOpen = true
    }

    watch(currentProposal, (val) => {
      if (!val) state.isSecondingDrawerOpen = false
    })

    return {
      ...toRefs(state),
      proposals,
      currentProposal,
      openSeconding,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.proposals-list {
  overflow-x: auto;

  @include scrollbar;
}

.proposals-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    & > :first-child {
      grid-column: 1/3;
    }

    @include democracy-proposal-grid-row(flex-end);
  }
}

.proposals-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}
</style>
