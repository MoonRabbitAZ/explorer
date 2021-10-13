<template>
  <div class="gilt-overview-tab">
    <div class="gilt-overview-tab__topbar">
      <gilt-summary class="gilt-overview-tab__summary" />

      <app-button
        class="gilt-overview-tab__bid-btn"
        scheme="primary"
        :text="$t('gilt-page.gilt-overview-tab.submit-bid-btn')"
        disabled
      />
    </div>

    <queues-list />
  </div>
</template>

<script>
import GiltSummary from '@gilt-page/tabs/gilt-overview/GiltSummary'
import QueuesList from '@gilt-page/tabs/gilt-overview/QueuesList'

export default {
  name: 'gilt-overview-tab',

  components: { QueuesList, GiltSummary },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.gilt-overview-tab { @include app-padding; }

.gilt-overview-tab__topbar {
  display: flex;
  align-items: center;
  gap: 3.2rem;
  margin: 3rem 0;

  @include respond-to($tablet) {
    flex-direction: column;
    align-items: start;
  }
}

.gilt-overview-tab__summary {
  @include respond-to($tablet) {
    width: 100%;
  }
}

.gilt-overview-tab__bid-btn {
  margin-left: auto;

  @include respond-to($x-small) {
    width: 100%;
  }
}
</style>
