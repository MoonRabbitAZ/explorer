<template>
  <div class="staking-list">
    <h1 class="staking-list__header">
      {{ $t('staking-header') }}
    </h1>

    <template v-if="stakingList.length">
      <staking-account-row
        v-for="(staking, id) in stakingList"
        :key="id"
        class="staking-list__row"
        :staking="staking"
      />
    </template>
    <template v-else>
      <no-data-message
        :message="$t('no-data-message')"
        is-row-block
      />
    </template>
  </div>
</template>

<script>
import StakingAccountRow from '@wallet-page/tabs/staking-tab/StakingAccountRow'
import NoDataMessage from '@/vue/common/NoDataMessage'

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
  min-width: 65rem;

  & + & {
    margin-top: 0.4rem;
  }
}
</style>

<i18n>
{
  "en": {
    "staking-header": "Staking",
    "no-data-message": "No stakes available"
  }
}
</i18n>
