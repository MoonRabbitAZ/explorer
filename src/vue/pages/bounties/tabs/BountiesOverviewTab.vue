<template>
  <div class="bounties-overview-tab">
    <div class="bounties-overview-tab__topbar">
      <bounties-summary class="bounties-overview-tab__summary" />

      <app-button
        class="bounties-overview-tab__bid-btn"
        scheme="primary"
        :text="$t('bounties-page.bounties-overview-tab.add-bounty-btn')"
        disabled
      />
    </div>

    <bounties-list />
  </div>
</template>

<script>
import BountiesSummary from '@bounties-page/tabs/bounties-overview/BountiesSummary'
import BountiesList from '@bounties-page/tabs/bounties-overview/BountiesList'

export default {
  name: 'bounties-overview-tab',

  components: { BountiesList, BountiesSummary },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bounties-overview-tab { @include app-padding; }

.bounties-overview-tab__topbar {
  display: flex;
  align-items: center;
  gap: 3.2rem;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.bounties-overview-tab__summary {
  @include respond-to($tablet) {
    width: 100%;
  }
}

.bounties-overview-tab__bid-btn {
  margin-left: auto;

  @include respond-to($x-small) {
    width: 100%;
  }
}
</style>
