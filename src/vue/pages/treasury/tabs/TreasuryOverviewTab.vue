<template>
  <div class="treasury-overview-tab">
    <treasury-summary />

    <div class="treasury-overview-tab__topbar">
      <app-button
        scheme="primary"
        :text="$t('treasury-page.treasury-overview-tab.submit-proposal-btn')"
        disabled
      />
    </div>

    <approved-list class="treasury-overview-tab__list"/>
    <proposals-list class="treasury-overview-tab__list"/>
  </div>
</template>

<script>
import TreasurySummary from '@treasury-page/tabs/treasury-overview/TreasurySummary'
import ApprovedList from '@treasury-page/tabs/treasury-overview/ApprovedList'
import ProposalsList from '@treasury-page/tabs/treasury-overview/ProposalsList'

export default {
  name: 'treasury-overview-tab',

  components: {
    TreasurySummary,
    ProposalsList,
    ApprovedList,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.treasury-overview-tab { @include app-padding; }

.treasury-overview-tab__topbar {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  margin: 3rem 0;

  @include respond-to($x-small) {
    flex-direction: column;
    width: 100%;
  }
}

.treasury-overview-tab__list {
  & + & {
    margin-top: 3rem;
  }
}
</style>
