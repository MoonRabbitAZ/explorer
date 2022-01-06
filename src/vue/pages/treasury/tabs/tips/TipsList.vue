<template>
  <div class="tips-list">
    <div
      class="tips-list__headers"
      :class="{'tips-list__headers--grid': tipsWithHashes?.length}"
    >
      <h1>
        {{ $t('treasury-page.tips-list.tips-header') }}
      </h1>
      <template v-if="tipsWithHashes?.length">
        <h4>
          {{ $t('treasury-page.tips-list.finder-header') }}
        </h4>
        <h4>
          {{ $t('treasury-page.tips-list.median-header') }}
        </h4>
      </template>
    </div>
    <template v-if="tipsWithHashes">
      <template v-if="tipsWithHashes.length">
        <tip-row
          v-for="(item, index) in tipsWithHashes"
          :key="index"
          :tip="item.tip"
          :tip-hash="item.hash"
          @open-tippers="openTippers"
        />
      </template>
      <template v-else>
        <no-data-message
          class="tips-list__no-data"
          :message="$t('treasury-page.tips-list.no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>

    <drawer
      v-model:is-shown="isTippersDrawerOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('treasury-page.tips-list.tippers-drawer-header') }}
      </template>
      <tippers-info :tip="currentTip.tip"/>
    </drawer>
  </div>
</template>

<script>
import TipRow from '@treasury-page/tabs/tips/TipRow'
import TippersInfo from '@treasury-page/tabs/tips/TippersInfo'
import Drawer from '@/vue/common/Drawer'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { reactive, toRefs, computed, watch } from 'vue'
import { useTipsWithHashes } from '@treasury-page/composables/useTipsWithHashes'

export default {
  name: 'tips-list',

  components: {
    TipRow,
    TippersInfo,
    Drawer,
    SkeletonLoader,
    NoDataMessage,
  },

  setup () {
    const state = reactive({
      isTippersDrawerOpen: false,
      currentTipHash: '',
    })

    const tipsWithHashes = useTipsWithHashes()

    const currentTip = computed(() =>
      tipsWithHashes.value?.find(({ hash }) => state.currentTipHash === hash),
    )

    function openTippers (hash) {
      state.currentTipHash = hash
      state.isTippersDrawerOpen = true
    }

    watch(currentTip, (value) => {
      if (!value) state.isTippersDrawerOpen = false
    })

    return {
      ...toRefs(state),
      tipsWithHashes,
      currentTip,
      openTippers,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.tips-list {
  overflow-x: auto;

  @include scrollbar;
}

.tips-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    & > :last-child {
      grid-column: 3/-1;
    }

    @include treasury-tip-grid-row(flex-end);
  }
}

</style>
