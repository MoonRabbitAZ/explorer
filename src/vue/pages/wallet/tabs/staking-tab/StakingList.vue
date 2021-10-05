<template>
  <div class="staking-list">
    <h1 class="staking-list__header">
      {{ $t('wallet-page.staking-list.staking-header') }}
    </h1>

    <template v-if="stakingList.length">
      <staking-account-row
        v-for="(staking, id) in stakingList"
        :key="id"
        class="staking-list__row"
        :staking="staking"
        @withdrawn="withdrawn"
      />
    </template>
    <template v-else>
      <no-data-message
        is-row-block
        :message="$t('wallet-page.staking-list.no-data-message')"
      />
    </template>
  </div>
</template>

<script>
import StakingAccountRow from '@wallet-page/tabs/staking-tab/StakingAccountRow'
import NoDataMessage from '@/vue/common/NoDataMessage'

const EVENTS = { withdrawn: 'withdrawn' }

export default {
  name: 'staking-list',

  components: {
    StakingAccountRow,
    NoDataMessage,
  },

  props: {
    stakingList: {
      type: Array,
      required: true,
    },
  },

  emits: Object.values(EVENTS),

  setup (_, { emit }) {
    function withdrawn () { emit(EVENTS.withdrawn) }

    return { withdrawn }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-list {
  overflow-x: auto;
  padding-bottom: 1rem;

  @include scrollbar;
}

.staking-list__header {
  margin-bottom: 2rem;
}

.staking-list__row {
  min-width: 75rem;

  & + & {
    margin-top: 0.4rem;
  }
}
</style>
