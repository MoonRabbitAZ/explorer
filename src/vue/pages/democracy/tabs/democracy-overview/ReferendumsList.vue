<template>
  <div class="referendums-list">
    <div
      class="referendums-list__headers"
      :class="{'referendums-list__headers--grid': referendums?.length}"
    >
      <h1>
        {{ $t('democracy-page.referendums-list.referenda-header') }}
      </h1>
      <template v-if="referendums?.length">
        <h3>
          {{ $t('democracy-page.referendums-list.remaining-header') }}
        </h3>
        <h3>
          {{ $t('democracy-page.referendums-list.activate-header') }}
        </h3>
      </template>
    </div>
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
      ref="drawer"
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
        :scrolled-element="drawerBody"
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

import { computed, reactive, ref, toRefs, watch, nextTick } from 'vue'

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
      drawerBody: null,
    })
    const drawer = ref(null)

    function openVotes (index) {
      state.currentReferendumIndex = index
      state.isVotesDrawerOpen = true
    }

    const currentReferendum = computed(() =>
      props.referendums?.find(({ index }) =>
        index.toString() === state.currentReferendumIndex,
      ),
    )

    watch(currentReferendum, (value) => {
      if (!value) state.isVotesDrawerOpen = false
    })

    watch(() => state.isVotesDrawerOpen, async (value) => {
      if (value) {
        await nextTick()
        state.drawerBody = drawer.value?.$el?.querySelector('.drawer__body')
      }
    })

    return {
      ...toRefs(state),
      openVotes,
      currentReferendum,
      drawer,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.referendums-list {
  overflow-x: auto;

  @include scrollbar;
}

.referendums-list__headers {
  padding: 0 1.6rem;
  margin-bottom: 2rem;

  &--grid {
    & > :first-child {
      grid-column: 1/3;
    }

    @include democracy-referendum-grid-row(flex-end);
  }
}

</style>
