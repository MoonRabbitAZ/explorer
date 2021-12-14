<template>
  <div class="dispatch-queue-list">
    <div
      class="dispatch-queue-list__headers"
      :class="{'dispatch-queue-list__headers--grid': filteredQueued?.length}"
    >
      <h1>
        {{ $t('democracy-page.dispatch-queue-list.dispatch-queue-header') }}
      </h1>
      <template v-if="filteredQueued?.length">
        <h4>
          {{ $t('democracy-page.dispatch-queue-list.enact-header') }}
        </h4>
      </template>
    </div>
    <template v-if="filteredQueued">
      <template v-if="filteredQueued.length">
        <template
          v-for="(entry, index) in filteredQueued"
          :key="index"
        >
          <dispatch-entry-row
            class="dispatch-queue-list__row"
            :entry="entry"
          />
        </template>
      </template>
      <template v-else>
        <no-data-message
          class="dispatch-queue-list__no-data"
          :message="$t('democracy-page.dispatch-queue-list.no-data-message')"
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
import DispatchEntryRow from '@democracy-page/tabs/dispatch/DispatchEntryRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'dispatch-queue-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
    DispatchEntryRow,
  },

  setup () {
    const bestNumber = useCall(api.derive.chain.bestNumber)
    const queued = useCall(api.derive.democracy.dispatchQueue)

    const filteredQueued = computed(() => {
      if (!bestNumber.value || !queued.value) return null
      return queued.value?.filter(({ at }) => at.gte(bestNumber.value))
    })

    return { filteredQueued }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.dispatch-queue-list {
  overflow-x: auto;

  @include scrollbar;
}

.dispatch-queue-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.dispatch-queue-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  & > :first-child {
    grid-column: 1/3;
  }

  &--grid {
    @include democracy-dispatch-grid-row(flex-end);
  }
}

.dispatch-queue-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}

</style>
