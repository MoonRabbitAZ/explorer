<template>
  <div class="council-overview-tab">
    <div class="council-overview-tab__topbar">
      <council-summary
        class="council-overview-tab__summary"
        :elections="electionsInfo"
        :has-elections="hasElections"
      />

      <div class="council-overview-tab__actions">
        <app-button
          class="council-overview-tab__button"
          scheme="primary"
          :text="$t('council-page.council-overview-tab.vote-btn')"
          disabled
        />
        <app-button
          class="council-overview-tab__button"
          scheme="primary"
          :text="$t('council-page.council-overview-tab.submit-candidacy-btn')"
          disabled
        />
      </div>
    </div>

    <div :class="{'council-overview-tab__body': hasElections}">
      <councils-list
        v-if="hasElections"
        :elections="electionsInfo"
        :prime="prime"
        :all-votes="allVotes"
        elections-list-type="candidates"
        class="council-overview-tab__list"
      />
      <councils-list
        :elections="electionsInfo"
        :prime="prime"
        :all-votes="allVotes"
        elections-list-type="members"
        class="council-overview-tab__list"
      />
      <councils-list
        v-if="hasElections"
        :elections="electionsInfo"
        :prime="prime"
        :all-votes="allVotes"
        elections-list-type="runnersUp"
        class="council-overview-tab__list"
      />
    </div>
  </div>
</template>

<script>
import CouncilSummary from '@council-page/tabs/council-overview/CouncilSummary'
import CouncilsList from '@council-page/tabs/council-overview/CouncilsList'

import { useCall } from '@/vue/composables'
import { api } from '@api'
import { useAllVotes } from '@council-page/composables/useAllVotes'
import { useModuleElections } from '@council-page/composables/useModuleElections'

export default {
  name: 'council-overview-tab',

  components: {
    CouncilSummary,
    CouncilsList,
  },

  setup () {
    const prime = useCall(api.derive.council.prime)
    const electionsInfo = useCall(api.derive.elections.info)
    const allVotes = useAllVotes()
    const { hasElections } = useModuleElections()

    return {
      prime,
      electionsInfo,
      allVotes,
      hasElections,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.council-overview-tab { @include app-padding; }

.council-overview-tab__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 3rem 0;
  gap: 2rem;
  flex-wrap: wrap;

  @include respond-to($tablet) {
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
  }
}

.council-overview-tab__summary {
  @include respond-to($tablet) {
    width: 100%;
  }
}

.council-overview-tab__actions {
  display: flex;

  @include respond-to($x-small) {
    flex-direction: column;
    width: 100%;
  }
}

.council-overview-tab__button {
  & + & {
    margin-left: 2rem;

    @include respond-to($x-small) {
      margin-left: 0;
      margin-top: 2rem;
    }
  }
}

.council-overview-tab__body {
  display: grid;
  gap: 2rem 3.4rem;
  grid-template-columns: minmax(15rem, 0.3fr)  minmax(15rem, 0.7fr);

  @include respond-to($sidebar-hide-bp) {
    grid-template-columns: 1fr;
  }
}

.council-overview-tab__list {
  &:first-child {
    grid-row: 1/3;

    @include respond-to($sidebar-hide-bp) {
      grid-row: 3/4;
    }
  }
}
</style>
