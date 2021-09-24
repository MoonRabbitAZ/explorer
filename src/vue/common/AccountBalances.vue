<template>
  <div class="account-balances">
    <template v-if="balancesAll">
      <p class="account-balances__total">
        {{ $fbalance(totalBalance) }}
      </p>

      <readonly-row
        class="account-balances__row"
        v-if="!availableBalance.isZero()"
        :label="$t('transferrable-lbl')"
        :value="$fbalance(availableBalance)"
      />

      <readonly-row
        class="account-balances__row"
        v-if="!balancesAll.lockedBalance.isZero()"
        :label="$t('staked-lbl')"
        :value="$fbalance(balancesAll.lockedBalance)"
      />
    </template>
    <template v-else>
      <skeleton-loader
        v-for="(item, id) in 3"
        :key="id"
        class="account-balances__sceleton-loader"
      />
    </template>
  </div>
</template>

<script>
import ReadonlyRow from '@/vue/common/ReadonlyRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { computed } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { ADMIN_ADDRESS, DEDUCTIBLE_BALANCE } from '@/js/const/deducticable-balance.const'

export default {
  name: 'account-balances',

  components: { ReadonlyRow, SkeletonLoader },

  props: {
    accountAddress: { type: String, required: true },
  },

  setup (props) {
    const balancesAll = useCall(api.derive.balances.all, [props.accountAddress])

    const totalBalance = computed(() => {
      if (!balancesAll.value) return
      return props.accountAddress === ADMIN_ADDRESS
        ? balancesAll.value.freeBalance.sub(DEDUCTIBLE_BALANCE)
        : balancesAll.value.freeBalance
    })

    const availableBalance = computed(() => {
      if (!balancesAll.value) return
      return props.accountAddress === ADMIN_ADDRESS
        ? balancesAll.value.availableBalance.sub(DEDUCTIBLE_BALANCE)
        : balancesAll.value.availableBalance
    })

    return {
      balancesAll,
      totalBalance,
      availableBalance,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.account-balances__total {
  font-size: 2rem;
  color: $col-app-accent;
}

.account-balances__row {
  margin-top: 2rem;
}

.account-balances__sceleton-loader {
  height: 1.2rem;

  & + & {
    margin-top: 2rem;
  }
}
</style>

<i18n>
{
  "en": {
    "transferrable-lbl": "Transferrable",
    "staked-lbl": "Staked"
  }
}
</i18n>
