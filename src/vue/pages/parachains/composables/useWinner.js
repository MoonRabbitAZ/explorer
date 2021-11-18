import { ref, watch } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { BN_ZERO, BN, u8aEq, stringToU8a } from '@polkadot/util'
import { useLeaseRanges, useEventTrigger } from './useLeaseRanges'
export const CROWD_PREFIX = stringToU8a('modlpy/cfund')

const FIRST_PARAM = [0]

function isNewWinners (a, b) {
  return JSON.stringify({ w: a }) !== JSON.stringify({ w: b })
}

function isNewOrdering (a, b) {
  return a.length !== b.length ||
    a.some(({ firstSlot, lastSlot, paraId }, index) =>
      !paraId.eq(b[index].paraId) ||
      !firstSlot.eq(b[index].firstSlot) ||
      !lastSlot.eq(b[index].lastSlot),
    )
}

function extractWinners (ranges, auctionInfo, optData) {
  return optData.isNone
    ? []
    : optData.unwrap().reduce((winners, optEntry, index) => {
      if (optEntry.isSome) {
        const [accountId, paraId, value] = optEntry.unwrap()
        const period = auctionInfo.leasePeriod || BN_ZERO
        const [first, last] = ranges[index]

        winners.push({
          accountId: accountId.toString(),
          firstSlot: period.addn(first),
          isCrowdloan:
            u8aEq(CROWD_PREFIX, accountId.subarray(0, CROWD_PREFIX.length)),
          key: paraId.toString(),
          lastSlot: period.addn(last),
          paraId,
          value,
        })
      }

      return winners
    }, [])
}

function createWinning ({ endBlock }, blockOffset, winners) {
  return {
    blockNumber: endBlock && blockOffset
      ? blockOffset.add(endBlock)
      : blockOffset || BN_ZERO,
    blockOffset: blockOffset || BN_ZERO,
    total: winners.reduce((total, { value }) => total.iadd(value), new BN(0)),
    winners,
  }
}

function extractData (ranges, auctionInfo, values) {
  return values
    .sort(([{ args: [a] }], [{ args: [b] }]) => a.cmp(b))
    .reduce((all, [{ args: [blockOffset] }, optData]) => {
      const winners = extractWinners(ranges, auctionInfo, optData)

      winners.length && (
        all.length === 0 ||
        isNewWinners(winners, all[all.length - 1].winners)
      ) && all.push(createWinning(auctionInfo, blockOffset, winners))

      return all
    }, [])
    .reverse()
}

function mergeCurrent (ranges, auctionInfo, prev, optCurrent, blockOffset) {
  const current = createWinning(
    auctionInfo,
    blockOffset,
    extractWinners(ranges, auctionInfo, optCurrent))

  if (current.winners.length) {
    if (!prev || !prev.length) {
      return [current]
    }

    if (isNewWinners(current.winners, prev[0].winners)) {
      if (isNewOrdering(current.winners, prev[0].winners)) {
        return [current, ...prev]
      }

      prev[0] = current

      return [...prev]
    }
  }

  return prev
}

function mergeFirst (ranges, auctionInfo, prev, optFirstData) {
  if (prev && prev.length <= 1) {
    const updated = prev || []
    const firstEntry = createWinning(
      auctionInfo,
      null,
      extractWinners(ranges, auctionInfo, optFirstData),
    )

    if (!firstEntry.winners.length) {
      return updated
    } else if (!updated.length) {
      return [firstEntry]
    }

    updated[updated.length - 1] = firstEntry

    return updated.slice()
  }

  return prev
}

export function useWinningDataImpl (auctionInfo) {
  const ranges = useLeaseRanges()
  const result = ref({})
  const bestNumber = useCall(api.derive.chain.bestNumber)
  const trigger = useEventTrigger([api.events.auctions?.BidAccepted])
  const initialEntries = useCall(api.query.auctions?.winning.entries)
  const optFirstData = useCall(api.query.auctions?.winning, FIRST_PARAM)

  // should be fired once, all entries as an initial round
  watch([auctionInfo, initialEntries, ranges], () => {
    result.value = extractData(ranges, auctionInfo, initialEntries)
  })

  // when block 0 changes, update (typically in non-ending-period, static otherwise)
  watch([auctionInfo, optFirstData, ranges], (prev) => {
    result.value = mergeFirst(ranges, auctionInfo, prev, optFirstData)
  })

  // on a bid event, get the new entry (assuming the event really triggered, i.e. not just a block)
  // and add it to the list when not duplicated. Additionally we cleanup after ourselves when endBlock
  // gets cleared
  watch([bestNumber, auctionInfo, ranges, trigger], (prev) => {
    result.value = mergeCurrent(ranges, auctionInfo, prev, optFirstData)
  })

  return result
}
