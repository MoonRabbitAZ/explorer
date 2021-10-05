<template>
  <div class="parachains-overview-tab">
    <parachains-summary
      class="parachains-overview-tab__summary"
      :parachains-amount="parachainIds?.length"
      :parathread-amount="threadIds?.length"
      :lease-period="leasePeriod"
    />
    <parachains-list
      :parachain-ids="parachainIds"
      :lease-period="leasePeriod"
    />
  </div>
</template>

<script>
import ParachainsSummary from '@parachains-page/tabs/parachains-overview/ParachainsSummary'
import ParachainsList from '@parachains-page/tabs/parachains-overview/ParachainsList'

import { computed } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { useLeasePeriod } from '@parachains-page/composables/useLeasePeriod'
import { useThreadIds } from '@parachains-page/composables/useThreadIds'

export default {
  name: 'parachains-overview-tab',

  components: {
    ParachainsSummary,
    ParachainsList,
  },

  setup () {
    const parachains = useCall(api.query.paras.parachains)
    const threadIds = useThreadIds()
    const { leasePeriod } = useLeasePeriod()

    const parachainIds = computed(() =>
      parachains.value && parachains.value.map(id => id.toString()),
    )

    return {
      parachainIds,
      leasePeriod,
      threadIds,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachains-overview-tab { @include app-padding; }

.parachains-overview-tab__summary {
  margin-bottom: 3rem;
}
</style>
