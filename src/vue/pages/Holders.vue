<template>
  <div class="holders">
    <div class="holders__headers">
      <h1 class="holders__header-main">
        {{ $t('holders-page.holders-header') }}
      </h1>
      <h4>
        {{ $t('holders-page.balances-header') }}
      </h4>
    </div>

    <template v-if="holders">
      <template v-if="sortedHolders.length">
        <div
          v-for="holder in sortedHolders"
          :key="holder.address"
          class="holders__holder-row"
        >
          <p>
            {{ holder.currentNumber }}
          </p>
          <account-address
            :account-address="holder.address"
          />
          <p
            v-tooltip="$fFullBalance(holder.balance)"
            :key="holder.balance.toString()"
          >
            {{ $fbalance(holder.balance) }}
          </p>
        </div>
      </template>

      <template v-else>
        <no-data-message
          is-row-block
          :message="$t('holders-page.no-data-message')"
        />
      </template>
    </template>

    <template v-else>
      <skeleton-loader
        v-for="(item, id) in 3"
        :key="id"
        class="holders__sceleton-loader"
      />
    </template>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { keyring } from '@polkadot/ui-keyring'
import { ADMIN_ADDRESS, DEDUCTIBLE_BALANCE } from '@/js/const/deducticable-balance.const'

const AMOUNT_LIST_ITEMS = 100

export default {
  name: 'holders',

  components: {
    AccountAddress,
    SkeletonLoader,
    NoDataMessage,
  },

  setup () {
    const holders = useCall(api.query.system.account.entries)

    const sortedHolders = computed(() => {
      if (!holders.value) return []

      const sort = [...holders.value].sort((a, b) =>
        b[1].data.free.cmp(a[1].data.free)).slice(0, AMOUNT_LIST_ITEMS)
      return sort.map((item, index) => {
        const address = keyring.encodeAddress(item[0].slice(-32))
        const balance = address === ADMIN_ADDRESS
          ? item[1].data.free.sub(DEDUCTIBLE_BALANCE).toString()
          : item[1].data.free.toString()

        return {
          currentNumber: (index + 1 < 10 ? '0' : '') + (index + 1),
          address,
          balance,
        }
      })
    })

    return {
      holders,
      sortedHolders,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.holders {
  margin-top: 4rem;

  @include app-padding;
}

.holders__headers,
.holders__holder-row {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 2rem 1fr 10rem;
  padding: 0 1.6rem;
}

.holders__headers {
  margin-bottom: 2rem;
}

.holders__holder-row {
  align-items: center;
  height: 5.2rem;

  @include content-block;

  & + & {
    margin-top: 0.4rem;
  }
}

.holders__header-main {
  grid-column: 1/3;
}

.holders__sceleton-loader {
  height: 5.2rem;

  & + & {
    margin-top: 0.4rem;
  }
}
</style>
