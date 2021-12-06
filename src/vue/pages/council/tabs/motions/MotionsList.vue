<template>
  <div class="motions-list">
    <h1 class="motions-list__header">
      {{ $t('council-page.motions-list.motions-header') }}
    </h1>
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
            @open-voters="openVotersInfo"
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
      v-model:is-shown="isVotersInfoOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('council-page.motions-list.drawer-motion-header', {
          index: currentMotionHash
        }) }}
      </template>
      <motion-voters />
    </drawer>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import MotionRow from '@council-page/tabs/motions/MotionRow'
import MotionVoters from '@council-page/tabs/motions/MotionVoters'
import Drawer from '@/vue/common/Drawer'

import { reactive, toRefs, computed } from 'vue'

export default {
  name: 'motions-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
    MotionRow,
    MotionVoters,
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
      isVotersInfoOpen: false,
      currentMotionHash: '',
    })

    function openVotersInfo () {
      state.isVotersInfoOpen = true
    }

    const currentMotion = computed(() => {
      if (!state.currentMotionIndex) return null
      return props.motions.find(i =>
        state.currentMotionHash === i.hash.toHex())
    })

    return {
      ...toRefs(state),
      openVotersInfo,
      currentMotion,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.motions-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.motions-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}

</style>
