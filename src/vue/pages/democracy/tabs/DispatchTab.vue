<template>
  <div class="dispatch-tab">
    <dispatch-queue-list class="dispatch-tab__list"/>

    <template v-if="api.query.scheduler">
      <scheduled-list class="dispatch-tab__list"/>
    </template>
  </div>
</template>

<script>
import DispatchQueueList from '@democracy-page/tabs/dispatch/DispatchQueueList'
import ScheduledList from '@democracy-page/tabs/dispatch/ScheduledList'

import { api } from '@api'
export default {
  name: 'dispatch-tab',

  components: {
    ScheduledList,
    DispatchQueueList,
  },

  setup () { return { api } },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.dispatch-tab { @include app-padding; }

.dispatch-tab__list {
  & + & {
    margin-top: 3rem;
  }
}
</style>
