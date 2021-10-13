<template>
  <div class="suspended-tab">
    <suspended-members-list class="suspended-tab__members-list"/>

    <suspended-candidates-list />
  </div>
</template>

<script>
import SuspendedCandidatesList from '@society-page/tabs/suspended/SuspendedCandidatesList'
import SuspendedMembersList from '@society-page/tabs/suspended/SuspendedMembersList'

export default {
  name: 'suspended-tab',

  components: { SuspendedCandidatesList, SuspendedMembersList },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.suspended-tab { @include app-padding; }

.suspended-tab__members-list {
  margin-bottom: 3rem;
}
</style>
