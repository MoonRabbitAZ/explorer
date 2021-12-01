<template>
  <div class="council-vote">
    <account-address
      class="council-vote__account"
      :account-address="accountId"
    />
    <template v-if="votes">
      <div
        v-tooltip="$fFullBalance(votes?.stake)"
        class="council-vote__balance"
      >
        {{ $fbalance(votes?.stake) }}
      </div>
    </template>
    <template v-else>
      <skeleton-loader
        class="council-vote__loader"
      />
    </template>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'council-vote',

  components: {
    AccountAddress,
    SkeletonLoader,
  },

  props: {
    accountId: { type: String, required: true },
  },

  setup (props) {
    const votes = useCall(api.derive.council.votesOf, [props.accountId])

    return {
      votes,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.council-vote {
  display: grid;
  grid-gap: 0 1.6rem;
  grid-template-columns: 1fr 12rem;
  align-items: center;
}

.council-vote__balance {
  justify-self: end;
}

.council-vote__loader {
  height: 2rem;
}
</style>
