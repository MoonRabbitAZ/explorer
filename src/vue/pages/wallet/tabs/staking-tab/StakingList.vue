<template>
  <div class="staking-list">
    <h1 class="staking-list__header">
      {{ $t('staking-header') }}
    </h1>
    <staking-account-row
      v-for="(staking, id) in stakingList"
      :key="id"
      class="staking-list__row"
      :staking="staking"
    />
  </div>
</template>

<script>
import StakingAccountRow from '@wallet-page/tabs/staking-tab/StakingAccountRow'

export default {
  name: 'staking-list',

  components: {
    StakingAccountRow,
  },

  props: {
    stakingList: {
      type: Array,
      required: true,
    },
  },

  setup () {
    return {}
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-list__header {
  margin-bottom: 2rem;
}

.staking-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}
</style>

<i18n>
{
  "en": {
    "staking-header": "Staking"
  }
}
</i18n>
