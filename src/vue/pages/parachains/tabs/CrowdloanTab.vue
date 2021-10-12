<template>
  <div class="crowdloan-tab">
    <div class="crowdloan-tab__topbar">
      <crowdloan-summary class="crowdloan-tab__summary" />

      <app-button
        class="crowdloan-tab__add-fund-btn"
        scheme="primary"
        :text="$t('parachains-page.crowdloan-tab.add-fund-btn')"
        disabled="disabled"
      />
    </div>

    <crowdloan-completed-list class="crowdloan-tab__completed-list"/>
    <crowdloan-ongoing-list class="crowdloan-tab__ongoing-list"/>
  </div>
</template>

<script>
import CrowdloanSummary from '@parachains-page/tabs/crowdloan/CrowdloanSummary'
import CrowdloanCompletedList from '@parachains-page/tabs/crowdloan/CrowdloanCompletedList'
import CrowdloanOngoingList from '@parachains-page/tabs/crowdloan/CrowdloanOngoingList'

export default {
  name: 'crowdloan-tab',

  components: {
    CrowdloanSummary,
    CrowdloanOngoingList,
    CrowdloanCompletedList,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.crowdloan-tab { @include app-padding; }

.crowdloan-tab__topbar {
  display: flex;
  align-items: center;
  gap: 3.2rem;
  margin: 3rem 0;

  @include respond-to($x-small) {
    width: 100%;
    flex-direction: column;
  }
}

.crowdloan-tab__summary {
  @include respond-to($x-small) {
    width: 100%;
  }
}

.crowdloan-tab__add-fund-btn {
  margin-left: auto;

  @include respond-to($x-small) {
    width: 100%;
  }
}

.crowdloan-tab__completed-list {
  margin-bottom: 3rem;
}
</style>
