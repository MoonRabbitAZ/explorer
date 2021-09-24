<template>
  <div class="staking-account-row app__content-block">
    <account-address
      is-name-display
      :account-address="staking.address"
    />
    <p>
      {{ $fbalance(staking.amount) }}
    </p>
    <p>
      {{ `${staking.interestRate}%` }}
    </p>
    <p>
      {{ $fddmy(staking.createdAt) }}
    </p>
    <div>
      <app-button
        scheme="secondary"
        icon-name="money-stack"
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

  setup () {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-account-row {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 15rem 5rem 11rem 4.4rem;
  align-items: center;
  padding: 1rem 1.6rem;
}
</style>
