<template>
  <div class="account-address">
    <button
      class="account-address__addr-btn"
      type="button"
      @click="isInfoOpen = !isInfoOpen"
    >
      <account-address-row
        is-accent-color
        :account-address="accountAddress"
        :is-name-display="isNameDisplay"
        :is-text-elipsis="isTextElipsis"
        :icon-size="iconSize"
      />
    </button>

    <teleport to="#app__main">
      <drawer
        class="account-address__drawer"
        v-model:is-shown="isInfoOpen"
        is-default-body
      >
        <template #heading>
          {{ $t('common.account-address.information-title') }}
        </template>
        <div class="account-address__drawer-addr-wrap">
          <account-address-row
            :account-address="accountAddress"
            icon-size="big"
          />
        </div>
        <div class="account-address__drawer-balance-wrap">
          <h3 class="account-address__drawer-balance-header">
            {{ $t('common.account-address.balance-header') }}
          </h3>
          <account-balances :account-address="accountAddress"/>
        </div>
      </drawer>
    </teleport>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import AccountBalances from '@/vue/common/AccountBalances'
import AccountAddressRow from '@/vue/common/AccountAddressRow'

import { ref } from 'vue'

export default {
  name: 'account-address',

  components: { Drawer, AccountBalances, AccountAddressRow },

  props: {
    accountAddress: { type: String, required: true },
    isNameDisplay: { type: Boolean, default: false },
    iconSize: { type: String, default: 'medium' },
    isTextElipsis: { type: Boolean, default: true },
  },

  setup () {
    const isInfoOpen = ref(false)

    return { isInfoOpen }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.account-address {
  max-width: 100%;
  overflow: hidden;
}

.account-address__addr-btn {
  width: 100%;
  cursor: pointer;
  text-align: left;
}

.account-address__drawer-addr-wrap {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.account-address__drawer-balance-header {
  margin-bottom: 1.5rem;
}

.account-address__drawer-balance-wrap {
  margin-top: 3.2rem;
  padding: 0 $drawer-padding;
}
</style>
