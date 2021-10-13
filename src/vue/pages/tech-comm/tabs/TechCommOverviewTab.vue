<template>
  <div class="tech-comm-overview-tab">
    <tech-comm-summary />

    <members-list class="tech-comm-overview-tab__list"/>
  </div>
</template>

<script>
import TechCommSummary from '@tech-comm-page/tabs/tech-comm-overview/TechCommSummary'
import MembersList from '@tech-comm-page/tabs/tech-comm-overview/MembersList'

export default {
  name: 'tech-comm-overview-tab',

  components: {
    TechCommSummary,
    MembersList,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.tech-comm-overview-tab { @include app-padding; }

.tech-comm-overview-tab__list {
  margin-top: 3rem;
}
</style>
