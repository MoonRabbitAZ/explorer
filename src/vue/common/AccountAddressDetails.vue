<template>
  <div class="account-address-details">
    <div class="account-address-details__drawer-addr-wrap">
      <account-address-row
        :account-address="accountAddress"
        icon-size="big"
      />
    </div>
    <div class="account-address-details__content">
      <h3 class="account-address-details__drawer-balance-header">
        {{ $t('common.account-address-details.balance-header') }}
      </h3>
      <account-balances :account-address="accountAddress"/>
      <template v-if="isLoaded">
        <template v-if="!isLoadFailed && accountAddress.length">
          <h3 class="account-address-details__evm-accounts-header">
            <!-- eslint-disable-next-line max-len -->
            {{ $t('common.account-address-details.assigned-evm-addresses-header') }}
          </h3>
          <p
            v-for="acc in assignedEvmAccounts"
            :key="acc.id"
            class="account-address-details__evm-account"
          >
            {{ acc.id }}
          </p>
        </template>
      </template>
      <template v-else>
        <skeleton-loader class="account-address-details__skeleton-loader" />
      </template>
    </div>
  </div>
</template>

<script>
import AccountBalances from '@/vue/common/AccountBalances'
import AccountAddressRow from '@/vue/common/AccountAddressRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { reactive, toRefs } from 'vue'
import { addressStorageApi } from '@api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'account-address-details',

  components: {
    AccountBalances,
    AccountAddressRow,
    SkeletonLoader,
  },

  props: {
    accountAddress: { type: String, required: true },
  },

  setup (props) {
    const state = reactive({
      assignedEvmAccounts: [],
      isLoaded: false,
      isLoadFailed: false,
    })

    async function getAssignedAccounts () {
      state.isLoadFailed = false
      state.isLoaded = false
      try {
        const { data } = await addressStorageApi.get(`/integrations/address-storage/addresses/${props.accountAddress}`)
        state.assignedEvmAccounts = data.evmAddresses
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        state.isLoadFailed = true
      }
      state.isLoaded = true
    }

    getAssignedAccounts()

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.account-address-details {
  max-width: 100%;
  overflow: hidden;
}

.account-address-details__drawer-addr-wrap {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.account-address-details__drawer-balance-header {
  margin-bottom: 1.5rem;
}

.account-address-details__content {
  margin-top: 3.2rem;
  padding: 0 $drawer-padding;
}

.account-address-details__evm-accounts-header {
  color: $col-app-header-secondary;
  margin-top: 2rem;
}

.account-address-details__evm-account {
  margin-top: 1rem;
}

.account-address-details__skeleton-loader {
  height: 4.4rem;
  margin-top: 2rem;
}
</style>
