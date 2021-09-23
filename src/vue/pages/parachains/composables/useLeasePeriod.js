import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'

export function useLeasePeriod () {
  const bestNumber = useCall(api.derive.chain.bestNumber)
  const length = api.consts.slots.leasePeriod

  const leasePeriod = computed(() => {
    if (!bestNumber.value || !length) return

    const progress = bestNumber.value.mod(length)

    return {
      currentPeriod: bestNumber.value.div(length),
      length: api.consts.slots.leasePeriod,
      progress,
      remainder: length.sub(progress),
    }
  })

  return { leasePeriod }
}
