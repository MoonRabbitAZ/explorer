import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { BN_ONE } from '@polkadot/util'

const optQueueTotals = {
  transform: (queueTotals) => {
    return queueTotals
      .map(([numItems, balance], index) => ({
        balance,
        index: index + 1,
        numItems,
      }))
      .filter(({ balance }) => !balance.isZero())
  },
}

export function useGiltInfo () {
  const activeTotal = useCall(api.query.gilt.activeTotal)
  const queueTotals = useCall(
    api.query.gilt.queueTotals,
    undefined,
    optQueueTotals,
  )

  const activeIndex = computed(() => {
    return !activeTotal.value?.index || activeTotal.index.isZero()
      ? null
      : activeTotal.index.sub(BN_ONE)
  })

  return {
    activeTotal,
    queueTotals,
    activeIndex,
  }
}
