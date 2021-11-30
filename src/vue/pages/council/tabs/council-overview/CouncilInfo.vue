<template>
  <div class="council-info">
    <div
      v-if="isPrime"
      class="council-info__prime-wrap"
    >
      <icon
        class="council-info__prime-icon"
        name="crown"
      />
      <p class="council-info__prime-text">
        {{ $t('council-page.council-info.prime-voter') }}
      </p>
    </div>

    <div class="council-info__account">
      <account-address
        :account-address="accountId"
        icon-size="big"
        :is-text-elipsis="false"
      />
    </div>

    <value-displayer
      v-tooltip="$fFullBalance(balance)"
      class="council-info__backing"
      :header="$t('council-page.council-info.backing-header')"
      :value="$fbalance(balance)"
      :value-level="1"
    />
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'
import AccountAddress from '@/vue/common/AccountAddress'
import Icon from '@/vue/common/Icon'

import { BN } from '@polkadot/util'

export default {
  name: 'council-info',

  components: {
    ValueDisplayer,
    AccountAddress,
    Icon,
  },

  props: {
    accountId: { type: String, required: true },
    balance: { type: BN, default: null },
    isPrime: { type: Boolean, default: false },
  },

  setup (props) {
    return {

    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.council-info__prime-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 2.2rem;
  padding: 0 $drawer-padding;
}

.council-info__prime-icon {
  min-width: 2.4rem;
  width: 2.4rem;
  height: 2.4rem;
  margin-right: 2.4rem;
}

.council-info__prime-text {
  font-size: 1.6rem;
}

.council-info__account {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.council-info__backing {
  margin: 4rem 0;
  padding: 0 $drawer-padding;
}
</style>
