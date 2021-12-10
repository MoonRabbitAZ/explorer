<template>
  <div class="dispatch-queue-list">
    <h1 class="dispatch-queue-list__header">
      {{ $t('democracy-page.dispatch-queue-list.dispatch-queue-header') }}
    </h1>
    <template v-if="filteredQueued">
      <template v-if="filteredQueued.length">
        <template
          v-for="entry in filteredQueued"
          :key="entry.index.toString()"
        >
          <dispatch-entry-row
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

.dispatch-queue-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
