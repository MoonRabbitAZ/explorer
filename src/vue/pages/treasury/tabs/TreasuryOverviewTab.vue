<template>
  <div class="treasury-overview-tab">
    <treasury-summary
      :approval-count="proposals?.approvals.length"
      :proposal-count="proposals?.proposals.length"
    />

    <div class="treasury-overview-tab__topbar">
      <app-button
        scheme="primary"
        :text="$t('treasury-page.treasury-overview-tab.submit-proposal-btn')"
        disabled
      />
    </div>

    <proposals-list
      class="treasury-overview-tab__list"
      :proposals="proposals?.proposals"
    />

    <proposals-list
      class="treasury-overview-tab__list"
      :proposals="proposals?.approvals"
      is-approved
    />
  </div>
</template>

<script>
import TreasurySummary from '@treasury-page/tabs/treasury-overview/TreasurySummary'
import ProposalsList from '@treasury-page/tabs/treasury-overview/ProposalsList'

import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'treasury-overview-tab',

  components: {
    TreasurySummary,
    ProposalsList,
  },

  setup () {
    const proposals = useCall(api.derive.treasury.proposals)

    return { proposals }
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
