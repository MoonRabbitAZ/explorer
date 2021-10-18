<template>
  <div class="account-row">
    <div class="account-row__body">
      <div class="account-row__address">
        <account-address
          is-name-display
          :account-address="account.address"
        />
      </div>
      <div>
        {{ cryptoType }}
      </div>
      <div>
        <template v-if="totalBalance">
          {{ $fbalance(totalBalance) }}
        </template>
        <template v-else>
          <skeleton-loader
            class="account-row__balance-loader"
            without-background
          />
        </template>
      </div>
      <div class="account-row__actions">
        <app-button
          v-tooltip.bottom="
            $t('wallet-page.account-row.deposit-button-tooltip')
          "
          class="account-row__button"
          scheme="secondary"
          icon-name="money-stack"
          @click="isAccountDepositOpen = true"
        />
        <app-button
          v-tooltip.bottom="
            $t('wallet-page.account-row.transfer-button-tooltip')
          "
          class="account-row__button"
          scheme="secondary"
          icon-name="paper-plane"
          @click="isTransferFormOpen = true"
        />
      </div>
    </div>

    <drawer
      v-model:is-shown="isTransferFormOpen"
      is-default-body
      :close-by-click-outside="false"
    >
      <template #heading>
        {{ $t('wallet-page.account-row.transfer-drawer-title') }}
      </template>
      <transfer-form
        :from-account-address="account.address"
        @close-drawer="isTransferFormOpen = false"
      />
    </drawer>

    <drawer
      v-model:is-shown="isAccountDepositOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('wallet-page.account-row.deposit-drawer-title') }}
      </template>
      <account-deposit
        :account-address="account.address"
      />
    </drawer>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import Drawer from '@/vue/common/Drawer'
import TransferForm from '@/vue/forms/TransferForm'
import AccountDeposit from '@wallet-page/tabs/my-accounts/AccountDeposit'

import { computed, watch, reactive, toRefs } from 'vue'
import { useCryptoType, useCall } from '@/vue/composables'
import { api } from '@api'

const EVENTS = {
  balanceReceived: 'balance-received',
}

export default {
  name: 'account-row',

  components: {
    AccountAddress,
    SkeletonLoader,
    Drawer,
    TransferForm,
    AccountDeposit,
  },

  props: {
    account: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const state = reactive({
      isTransferFormOpen: false,
      isAccountDepositOpen: false,
    })
    const { cryptoType } = useCryptoType(props.account.address)
    const balancesAll = useCall(
      api.derive.balances?.all,
      [props.account.address],
    )

    const totalBalance = computed(() => balancesAll.value &&
        balancesAll.value.freeBalance.add(balancesAll.value.reservedBalance),
    )

    watch(balancesAll, () => {
      emit(EVENTS.balanceReceived, {
        address: props.account.address,
        balance: totalBalance.value,
      })
    })

    return {
      ...toRefs(state),
      cryptoType,
      totalBalance,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.account-row__body {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(2, 1fr) 15rem 11rem;
  align-items: center;
  padding: 1rem 1.6rem;

  @include content-block;
}

.account-row__address {
  min-width: 100%;
}

.account-row__balance-loader {
  height: 2.4rem;
  width: 100%;
}

.account-row__actions {
  display: flex;
}

.account-row__button {
  & + & {
    margin-left: 2rem;
  }
}
</style>
