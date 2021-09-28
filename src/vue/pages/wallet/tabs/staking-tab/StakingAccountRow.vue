<template>
  <div class="staking-account-row">
    <account-address
      is-name-display
      :account-address="staking.address"
    />
    <p>
      {{ $tglobal(`staking-options.types.type-${staking.stakeOptionId}`) }}
    </p>
    <p>
      {{ $fddmy(staking.createdAt) }}
    </p>
    <div>
      <app-button
        scheme="secondary"
        :text="$t('unstake-btn')"
        disabled
      />
    </div>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { StakingRecord } from '@/js/records/staking.record'

export default {
  name: 'staking-account-row',

  components: { AccountAddress },

  props: {
    staking: { type: StakingRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-account-row {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 15rem 11rem max-content;
  align-items: center;
  padding: 1rem 1.6rem;

  @include content-block;
}
</style>

<i18n>
{
  "en": {
    "unstake-btn": "Unstake"
  }
}
</i18n>
