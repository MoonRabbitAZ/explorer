<template>
  <div class="society-overview-tab">
    <society-summary class="society-overview-tab__summary" />

    <members-list />
  </div>
</template>

<script>
import SocietySummary from '@society-page/tabs/society-overview/SocietySummary'
import MembersList from '@society-page/tabs/society-overview/MembersList'

export default {
  name: 'society-overview-tab',

  components: { MembersList, SocietySummary },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.society-overview-tab { @include app-padding; }

.society-overview-tab__summary {
  margin-bottom: 3rem;
}
</style>
