<template>
  <div class="council-overview-tab">
    <council-summary />

    <div class="council-overview-tab__topbar">
      <app-button
        scheme="primary"
        :text="$t('council-page.council-overview-tab.vote-btn')"
        disabled
      />
      <app-button
        scheme="primary"
        :text="$t('council-page.council-overview-tab.submit-candidacy-btn')"
        disabled
      />
    </div>

    <members-list class="council-overview-tab__list"/>
    <runners-up-list class="council-overview-tab__list"/>
    <candidates-list class="council-overview-tab__list"/>
  </div>
</template>

<script>
import CouncilSummary from '@council-page/tabs/council-overview/CouncilSummary'
import MembersList from '@council-page/tabs/council-overview/MembersList'
import RunnersUpList from '@council-page/tabs/council-overview/RunnersUpList'
import CandidatesList from '@council-page/tabs/council-overview/CandidatesList'

export default {
  name: 'council-overview-tab',

  components: {
    CouncilSummary,
    MembersList,
    RunnersUpList,
    CandidatesList,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.council-overview-tab { @include app-padding; }

.council-overview-tab__topbar {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  margin: 3rem 0;

  @include respond-to($x-small) {
    flex-direction: column;
    width: 100%;
  }
}

.council-overview-tab__list {
  & + & {
    margin-top: 3rem;
  }
}
</style>
