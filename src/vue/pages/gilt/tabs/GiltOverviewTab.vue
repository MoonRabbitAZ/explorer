<template>
  <div class="gilt-overview-tab">
    <div class="gilt-overview-tab__topbar">
      <gilt-summary
        class="gilt-overview-tab__summary"
        :active-total="activeTotal"
        :is-active-gilt="isActiveGilt"
      />

      <app-button
        class="gilt-overview-tab__bid-btn"
        scheme="primary"
        :text="$t('gilt-page.gilt-overview-tab.submit-bid-btn')"
        disabled
      />
    </div>

    <queues-list
      :queue-totals="queueTotals"
    />
  </div>
</template>

<script>
import GiltSummary from '@gilt-page/tabs/gilt-overview/GiltSummary'
import QueuesList from '@gilt-page/tabs/gilt-overview/QueuesList'

import { computed } from 'vue'
import { useGiltInfo } from '@gilt-page/composables/useGiltInfo'

export default {
  name: 'gilt-overview-tab',

  components: { QueuesList, GiltSummary },

  setup () {
    const { queueTotals, activeTotal } = useGiltInfo()

    const isActiveGilt = computed(() =>
      activeTotal.value && !activeTotal.value.target.isZero(),
    )

    return {
      queueTotals,
      activeTotal,
      isActiveGilt,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.gilt-overview-tab { @include app-padding; }

.gilt-overview-tab__topbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3.2rem;
  margin: 3rem 0;
}

.gilt-overview-tab__summary {
  @include respond-to($tablet) {
    width: 100%;
  }
}

.gilt-overview-tab__bid-btn {
  margin-left: auto;

  @include respond-to($x-small) {
    width: 100%;
  }
}
</style>
