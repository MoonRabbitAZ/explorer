<template>
  <div class="dispatch-tab">
    <dispatch-queue-list class="dispatch-tab__list"/>
    <scheduled-list class="dispatch-tab__list"/>
  </div>
</template>

<script>
import DispatchQueueList from '@democracy-page/tabs/dispatch/DispatchQueueList'
import ScheduledList from '@democracy-page/tabs/dispatch/ScheduledList'

export default {
  name: 'dispatch-tab',

  components: {
    ScheduledList,
    DispatchQueueList,
  },
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
