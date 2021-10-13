<template>
  <div class="proposals-tab">
    <div class="proposals-tab__topbar">
      <app-button
        scheme="primary"
        :text="$t('tech-comm-page.proposals-tab.submit-proposal-btn')"
        disabled
      />
    </div>

    <proposals-list />
  </div>
</template>

<script>
import ProposalsList from '@tech-comm-page/tabs/proposals/ProposalsList'

export default {
  name: 'proposals-tab',

  components: { ProposalsList },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.proposals-tab { @include app-padding; }

.proposals-tab__topbar {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;

  @include respond-to($x-small) {
    flex-direction: column;
    width: 100%;
  }
}
</style>
