import BN from 'bn.js'
import { computed } from 'vue'
import { api } from '@api'

const RANGES_DEFAULT = [
  [0, 0], [0, 1], [0, 2], [0, 3],
  [1, 1], [1, 2], [1, 3],
  [2, 2], [2, 3],
  [3, 3],
]

function isU32 (leasePeriodsPerSlot) { return Boolean(leasePeriodsPerSlot) }

export function useLeaseRanges () {
  return computed(() => {
    const leasePeriodsPerSlot = api.consts.auctions?.leasePeriodsPerSlot
    if (isU32(leasePeriodsPerSlot)) {
      const ranges = []

      for (let i = 0; leasePeriodsPerSlot.gtn(i); i++) {
        for (let j = i; leasePeriodsPerSlot.gtn(j); j++) {
          ranges.push([i, j])
        }
      }

      return ranges
    }

    return RANGES_DEFAULT
  })
}

export function useLeaseRangeMax () {
  const ranges = useLeaseRanges()

  return computed(() => new BN(ranges.value[ranges.value.length - 1][1]))
}
