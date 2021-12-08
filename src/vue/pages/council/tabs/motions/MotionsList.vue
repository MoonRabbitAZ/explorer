<template>
  <div class="motions-list">
    <div
      class="motions-list__headers"
      :class="{'motions-list__headers--grid': motions?.length}"
    >
      <h1 class="motions-list__main-header">
        {{ $t('council-page.motions-list.motions-header') }}
      </h1>
      <template v-if="motions?.length">
        <h4>
          {{ $t('council-page.motions-list.threshold-header') }}
        </h4>
        <h4>
          {{ $t('council-page.motions-list.voting-end-header') }}
        </h4>
      </template>
    </div>
    <template v-if="motions">
      <template v-if="motions.length">
        <div class="motions-list__body">
          <motion-row
            v-for="motion in motions"
            :key="motion.hash.toHex()"
            class="motions-list__row"
            :motion="motion"
            :members="members"
            :prime="prime"
            :is-member="isMember"
            @open-votes="openVotesInfo"
          />
        </div>
      </template>
      <template v-else>
        <no-data-message
          class="motions-list__no-data"
          :message="$t('council-page.motions-list.no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>

    <drawer
      v-model:is-shown="isVotesInfoOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('council-page.motions-list.votes-header') }}
      </template>
      <motion-votes
        :votes="currentMotion.votes"
        :members="members"
      />
    </drawer>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import MotionRow from '@council-page/tabs/motions/MotionRow'
import MotionVotes from '@council-page/tabs/motions/MotionVotes'
import Drawer from '@/vue/common/Drawer'

import { reactive, toRefs, computed, watch } from 'vue'

export default {
  name: 'motions-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
    MotionRow,
    MotionVotes,
    Drawer,
  },

  props: {
    motions: { type: Array, default: null },
    members: { type: Array, default: null },
    prime: { type: Object, default: null },
    isMember: { type: Boolean, default: false },
  },

  setup (props) {
    const state = reactive({
      isVotesInfoOpen: false,
      currentMotionHash: '',
    })

    function openVotesInfo (motionHash) {
      state.currentMotionHash = motionHash
      state.isVotesInfoOpen = true
    }

    const currentMotion = computed(() => {
      if (!state.currentMotionHash) return null
      return props.motions.find(i =>
        state.currentMotionHash === i.hash.toHex())
    })

    watch(currentMotion, (motion) => {
      if (motion) return
      state.isVotesInfoOpen = false
    })

    return {
      ...toRefs(state),
      openVotesInfo,
      currentMotion,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.motions-list {
  overflow-x: auto;

  @include scrollbar;
}

.motions-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    @include councils-motions-grid-row(flex-end);

    .motions-list__main-header {
      grid-column: 1/3;
    }
  }
}

.motions-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}

</style>
