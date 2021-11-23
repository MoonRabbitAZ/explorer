<template>
  <div class="bids-row">
    <div
      v-for="(item, index) in winnersWithLoans"
      :key="index"
      class="bids-row__bid"
    >
      <p>
        {{ item.paraId }}
      </p>
      <account-address :account-address="item.accountId"/>
      <p>
        {{ item.isCrowdloan
          ? $t('parachains-page.bids-row.is-crowdloan')
          : $t('parachains-page.bids-row.is-not-crowdloan')
        }}
      </p>
      <p>
        {{
          item.firstSlot.eq(item.lastSlot)
            ? $fnumber(item.firstSlot)
            : `${$fnumber(item.firstSlot)} - ${$fnumber(item.lastSlot)}`
        }}
      </p>
      <p>
        {{ $fbalance(item.value) }}
      </p>
    </div>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { BN } from '@polkadot/util'

export default {
  name: 'bids-list',

  components: { AccountAddress },

  props: {
    winnersWithLoans: { type: Array, required: true },
    blockNumber: { type: BN, default: null },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bids-row {
  padding: 1rem 1.6rem;

  @include content-block;
}

.bids-row__bid {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(3, 1fr) 15rem 11rem;
  align-items: center;
}

</style>
