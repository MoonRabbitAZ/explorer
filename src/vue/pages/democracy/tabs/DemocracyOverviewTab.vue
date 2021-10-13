<template>
  <div class="democracy-overview-tab">
    <democracy-summary />

    <div class="democracy-overview-tab__topbar">
      <app-button
        scheme="primary"
        :text="$t('democracy-page.democracy-overview-tab.submit-preimage-btn')"
        disabled
      />
      <app-button
        scheme="primary"
        :text="$t('democracy-page.democracy-overview-tab.submit-proposal-btn')"
        disabled
      />
    </div>

    <referendums-list class="democracy-overview-tab__list"/>
    <proposals-list class="democracy-overview-tab__list"/>
    <external-list class="democracy-overview-tab__list"/>
  </div>
</template>

<script>
import DemocracySummary from '@democracy-page/tabs/democracy-overview/DemocracySummary'
import ReferendumsList from '@democracy-page/tabs/democracy-overview/ReferendumsList'
import ProposalsList from '@democracy-page/tabs/democracy-overview/ProposalsList'
import ExternalList from '@democracy-page/tabs/democracy-overview/ExternalList'

export default {
  name: 'democracy-overview-tab',

  components: {
    DemocracySummary,
    ReferendumsList,
    ProposalsList,
    ExternalList,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.democracy-overview-tab { @include app-padding; }

.democracy-overview-tab__topbar {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  margin: 3rem 0;

  @include respond-to($x-small) {
    flex-direction: column;
    width: 100%;
  }
}

.democracy-overview-tab__list {
  & + & {
    margin-top: 3rem;
  }
}
</style>
