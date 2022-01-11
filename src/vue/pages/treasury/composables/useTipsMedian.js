import { computed } from 'vue'
import { BN_ZERO } from '@polkadot/util'

export function useTipsMedian (tips) {
  return computed(() => {
    if (!tips.value.length) return null

    const values = tips.value
      .map(([, value]) => value).sort((a, b) => a.cmp(b))
    const midIndex = Math.floor(values.length / 2)
    return values.length
      ? values.length % 2
        ? values[midIndex]
        : values[midIndex - 1].add(values[midIndex]).divn(2)
      : BN_ZERO
  })
}
