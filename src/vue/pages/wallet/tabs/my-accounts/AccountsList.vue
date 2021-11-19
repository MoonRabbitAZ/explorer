<template>
  <div class="accounts-list">
    <div class="accounts-list__wrap">
      <div class="accounts-list__headers">
        <h1>
          {{ $t('wallet-page.accounts-list.accounts-header') }}
        </h1>
        <h4>
          {{ $t('wallet-page.accounts-list.type-header') }}
        </h4>
        <h4 class="accounts-list__balace-header">
          {{ $t('wallet-page.accounts-list.balance-header') }}
        </h4>
      </div>
      <template v-if="accounts.length">
        <account-row
          class="accounts-list__account-row"
          v-for="account in accounts"
          :key="account.address"
          :account="account"
          @balance-received="setAccountBalance"
        />
        <div class="accounts-list__total">
          <p class="accounts-list__total-accounts">
            {{ $t('wallet-page.accounts-list.total-accounts',
                  { amount: amountAccounts})
            }}
          </p>
          <p
            class="accounts-list__total-balance"
          >
            {{ $t('wallet-page.accounts-list.total-balance',
                  { balance: $fbalance(fullBalance)})
            }}
          </p>
        </div>
      </template>
      <template v-else>
        <no-data-message
          is-row-block
          :message="$t('wallet-page.accounts-list.no-data-message')"
        />
      </template>
    </div>
  </div>
</template>

<script>
import AccountRow from '@wallet-page/tabs/my-accounts/AccountRow'
import NoDataMessage from '@/vue/common/NoDataMessage'

import BN from 'bn.js'

import { ref, computed } from 'vue'

export default {
  name: 'accounts-list',

  components: { AccountRow, NoDataMessage },

  props: {
    accounts: { type: Array, required: true },
    amountAccounts: { type: Number, required: true },
  },

  setup () {
    const accountsTotalBalances = ref({})

    function setAccountBalance (accountBalance) {
      accountsTotalBalances.value[accountBalance.address] =
        accountBalance.balance
    }

    const fullBalance = computed(() =>
      Object.values(accountsTotalBalances.value).reduce((accum, balance) =>
        accum.add(balance)
      , new BN(0)),
    )

    return {
      fullBalance,
      setAccountBalance,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.accounts-list {
  overflow-x: auto;

  @include scrollbar;
}

.accounts-list__wrap {
  min-width: 68.5rem;
}

.accounts-list__headers,
.accounts-list__total {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(2, 1fr) 15rem 11rem;
  padding: 0 1.6rem;
}

.accounts-list__headers {
  margin-bottom: 2rem;
}

.accounts-list__balace-header {
  grid-column: 3/-1;
}

.accounts-list__account-row {
  & + & {
    margin-top: 0.4rem;
  }
}

.accounts-list__total {
  margin: 4rem 0 1rem;
}

.accounts-list__total-accounts,
.accounts-list__total-balance {
  font-size: 1.4rem;
}

.accounts-list__total-balance {
  grid-column: 3/-1;
}
</style>
