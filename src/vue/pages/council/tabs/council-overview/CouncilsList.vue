<template>
  <div class="councils-list">
    <h1 class="councils-list__header">
      {{ $t('council-page.councils-list.members-header') }}
    </h1>
    <template v-if="elections && allVotes">
      <template
        v-if="elections.members.length
          && electionsListType === ELECTIONS_LIST_TYPE.members"
      >
        <template
          v-for="([accountId, balance]) in elections.members"
          :key="accountId.toString()"
        >
          <council-row
            class="councils-list__row"
            :account-id="accountId.toString()"
            :balance="balance"
            :is-prime="prime?.eq(accountId)"
            :voters-count="allVotes[accountId.toString()]?.length"
            :elections-list-type="electionsListType"
          />
        </template>
      </template>
      <template
        v-else-if="elections.candidates.length
          && electionsListType === ELECTIONS_LIST_TYPE.candidates"
      >
        <template
          v-for="(accountId) in elections.candidates"
          :key="accountId.toString()"
        >
          <council-row
            class="councils-list__row"
            :account-id="accountId.toString()"
            :voters-count="allVotes[accountId.toString()]?.length"
            :elections-list-type="electionsListType"
          />
        </template>
      </template>
      <template
        v-else-if="elections.runnersUp.length
          && electionsListType === ELECTIONS_LIST_TYPE.runnersUp"
      >
        <template
          v-for="([accountId, balance]) in elections.runnersUp"
          :key="accountId.toString()"
        >
          <council-row
            class="councils-list__row"
            :account-id="accountId.toString()"
            :balance="balance"
            :voters-count="allVotes[accountId.toString()]?.length"
            :elections-list-type="electionsListType"
          />
        </template>
      </template>
      <template v-else>
        <no-data-message
          class="councils-list__no-data"
          :message="$t('council-page.councils-list.members-no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>
  </div>
</template>

<script>
import CouncilRow from '@council-page/tabs/council-overview/CouncilRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { oneOf } from '@/js/helpers/type-validators'

const ELECTIONS_LIST_TYPE = {
  runnersUp: 'runnersUp',
  candidates: 'candidates',
  members: 'members',
}
export default {
  name: 'councils-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
    CouncilRow,
  },

  props: {
    elections: { type: Object, default: null },
    prime: { type: Object, default: null },
    allVotes: { type: Object, default: null },
    electionsListType: {
      type: String,
      required: true,
      validator: oneOf(ELECTIONS_LIST_TYPE),
    },
  },

  setup (props) {
    return {
      ELECTIONS_LIST_TYPE,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.councils-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.councils-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}

</style>
