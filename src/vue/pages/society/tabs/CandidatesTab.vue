<template>
  <div class="candidates-tab">
    <div class="candidates-tab__topbar">
      <app-button
        scheme="primary"
        :text="$t('society-page.candidates-tab.submit-bid-btn')"
        disabled
      />
    </div>

    <candidates-list class="candidates-tab__candidates-list"/>

    <bids-list />
  </div>
</template>

<script>
import CandidatesList from '@society-page/tabs/candidates/CandidatesList'
import BidsList from '@society-page/tabs/candidates/BidsList'

export default {
  name: 'candidates-tab',

  components: { CandidatesList, BidsList },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.candidates-tab { @include app-padding; }

.candidates-tab__topbar {
  display: flex;
  justify-content: flex-end;
}

.candidates-tab__candidates-list {
  margin: 3rem 0;
}
</style>
