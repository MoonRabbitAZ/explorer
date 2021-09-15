<template>
  <div class="holders">
    <div class="holders__headers">
      <h1 class="holders__header-main">
        {{ }}
      </h1>
      <h4 class="holders__header-secondary">
        {{ }}
      </h4>
    </div>
    <div
      v-for="item in sortedHolders"
      :key="item.account"
    >
      <span>{{ item.account }} </span>
      <span>{{ $fbalance(item.balance) }} </span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { keyring } from '@polkadot/ui-keyring'

export default {
  name: 'holders',

  components: {
  },

  setup () {
    const holders = useCall(api.query.system.account.entries)

    const sortedHolders = computed(() => {
      if (!holders.value) return []

      const sort = holders.value.map(i => i).sort((a, b) =>
        b[1].data.free.cmp(a[1].data.free))
      return sort.map(item => {
        return {
          account: keyring.encodeAddress(item[0].slice(-32)),
          balance: item[1].data.free.toString(),
        }
      }).slice(0, 100)
    })

    return {
      sortedHolders,
    }
  },
}
</script>

<i18n>
{
  "en": {
    "holders-header": "Holders",
    "balances-header": "balances"
  }
}
</i18n>
