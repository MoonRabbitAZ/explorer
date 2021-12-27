<template>
  <div class="referendums-list">
    <h1 class="referendums-list__header">
      {{ $t('democracy-page.referendums-list.referendums-header') }}
    </h1>
    <template v-if="referendums">
      <template v-if="referendums.length">
        <referendum-row
          v-for="(referendum, index) in referendums"
          :key="index"
          :referendum="referendum"
          @open-votes="openVotes"
        />
      </template>
      <template v-else>
        <no-data-message
          class="referendums-list__no-data"
          :message="$t('democracy-page.referendums-list.no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>

    <drawer
      class="referendums-list__votes-drawer"
      v-model:is-shown="isVotesDrawerOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('democracy-page.referendums-list.drawer-referendum-header', {
          index: currentReferendumIndex,
        }) }}
      </template>
      <referendum-votes
        :referendum="currentReferendum"
      />
    </drawer>
  </div>
</template>

<script>
import ReferendumRow from '@democracy-page/tabs/democracy-overview/ReferendumRow'
import ReferendumVotes from '@democracy-page/tabs/democracy-overview/ReferendumVotes'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Drawer from '@/vue/common/Drawer'

import { computed, reactive, toRefs } from 'vue'

export default {
  name: 'referendums-list',

  components: {
    ReferendumRow,
    ReferendumVotes,
    SkeletonLoader,
    NoDataMessage,
    Drawer,
  },

  props: {
    referendums: { type: Array, default: null },
  },

  setup (props) {
    const state = reactive({
      currentReferendumIndex: '',
      isVotesDrawerOpen: false,
    })

    function openVotes (index) {
      state.currentReferendumIndex = index
      state.isVotesDrawerOpen = true
    }

    const currentReferendum = computed(() =>
      props.referendums?.find(({ index }) =>
        index.toString() === state.currentReferendumIndex,
      ),
    )

    return {
      ...toRefs(state),
      openVotes,
      currentReferendum,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.referendums-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
