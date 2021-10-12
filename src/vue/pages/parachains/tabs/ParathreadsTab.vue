<template>
  <div class="parathreads-tab">
    <template v-if="threadIds">
      <parathreads-list :parathread-ids="threadIds"/>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import ParathreadsList from '@parachains-page/tabs/parathreads/ParathreadsList'
import Loader from '@/vue/common/Loader'

import { useThreadIds } from '@parachains-page/composables/useThreadIds'

export default {
  name: 'parathreads-tab',

  components: {
    ParathreadsList,
    Loader,
  },

  setup () {
    const threadIds = useThreadIds()

    return { threadIds }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parathreads-tab {
  @include app-padding;
}
</style>
