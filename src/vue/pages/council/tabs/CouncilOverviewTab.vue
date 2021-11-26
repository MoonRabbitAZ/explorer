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

    <councils-list
      :elections="electionsInfo"
      class="council-overview-tab__list"
    />
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
    const moduleElections = useModuleElections()

    return {
      prime,
      electionsInfo,
      allVotes,
      moduleElections,
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
