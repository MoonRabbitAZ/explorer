import { reactive, computed, toRefs, watch } from 'vue'
import { api } from '@api'
import { useMapKeys, useCall } from '@/vue/composables'
import { BN_ZERO, u8aConcat, BN, stringToU8a } from '@polkadot/util'
import { encodeAddress } from '@polkadot/util-crypto'

const CROWD_PREFIX = stringToU8a('modlpy/cfund')

const EMPTY_U8A = new Uint8Array(32)

const optFundMulti = {
  transform: ({ params: [paraIds], ev: optFunds }) =>
    paraIds.reduce((acc, paraId, i) => {
      const info = optFunds[i].unwrapOr(null)
      if (info) {
        acc.push({
          accountId: encodeAddress(createAddress(paraId)),
          firstSlot: info.firstPeriod,
          info,
          isCrowdloan: true,
          key: paraId.toString(),
          lastSlot: info.lastPeriod,
          paraId,
          value: info.raised,
        })
      }

      return acc
    }, [])
      .sort((a, b) =>
        a.info.end.cmp(b.info.end) ||
        a.info.firstPeriod.cmp(b.info.firstPeriod) ||
        a.info.lastPeriod.cmp(b.info.lastPeriod) ||
        a.paraId.cmp(b.paraId),
      ),
  withParamsTransform: true,
}

const optLeaseMulti = {
  transform: ({ params: [paraIds], ev: leases }) =>
    paraIds.filter((paraId, i) =>
      leases[i]
        .reduce((acc, opt, i) => {
          const options = opt.unwrapOr(null)
          if (options) {
            const [accountId] = options
            if (accountId.eq(createAddress(paraId))) {
              acc.push(options)
            }
          }
          return acc
        }, [])
        .length !== 0,
    ),
  withParamsTransform: true,
}

export function useFunds () {
  const state = reactive({
    activeCap: BN_ZERO,
    activeRaised: BN_ZERO,
    funds: null,
    totalCap: BN_ZERO,
    totalRaised: BN_ZERO,
  })
  const bestNumber = useCall(api.derive.chain.bestNumber)

  const paraIds = useMapKeys(
    [api.events.crowdloan?.Created],
    api.query.crowdloan?.funds,
    extractFundIds,
  )
  const paraIdsParam = computed(() => ([paraIds.value]))

  const campaigns = useCall(
    api.query.crowdloan?.funds.multi,
    paraIdsParam,
    optFundMulti,
  )
  const leases = useCall(
    api.query.slots.leases.multi,
    paraIdsParam,
    optLeaseMulti,
  )

  function fundsHandler () {
    if (!bestNumber.value || !campaigns.value || !leases.value) return
    createResult(
      bestNumber.value,
      api.consts.crowdloan.minContribution,
      campaigns.value,
      leases.value,
      state,
    )
  }
  // here we manually add the actual ending status and calculate the totals
  watch(
    [bestNumber, campaigns, leases],
    fundsHandler,
    { immediate: true },
  )

  return {
    ...toRefs(state),
  }
}

function createAddress (paraId) {
  return u8aConcat(CROWD_PREFIX, paraId.toU8a(), EMPTY_U8A).subarray(0, 32)
}

function hasLease (paraId, leased) {
  return leased.some((l) => l.eq(paraId))
}

// map into a campaign
function updateFund (bestNumber, minContribution, data, leased) {
  data.isCapped = data.info.cap.sub(data.info.raised).lt(minContribution)
  data.isEnded = bestNumber.gt(data.info.end)
  data.isWinner = hasLease(data.paraId, leased)

  return data
}

function isFundUpdated (
  bestNumber,
  minContribution,
  { info: { cap, end, raised }, paraId },
  leased,
  allPrev,
) {
  const prev = allPrev.funds?.find((p) => p.paraId.eq(paraId))

  return !prev ||
    (!prev.isEnded && bestNumber.gt(end)) ||
    (!prev.isCapped && cap.sub(raised).lt(minContribution)) ||
    (!prev.isWinner && hasLease(paraId, leased))
}

function sortCampaigns (a, b) {
  if (a.isWinner !== b.isWinner) {
    return a.isWinner ? -1 : 1
  } else if (a.isCapped !== b.isCapped) {
    return a.isCapped ? -1 : 1
  } else if (a.isEnded !== b.isEnded) {
    return a.isEnded ? 1 : -1
  } else {
    return 0
  }
}

// compare the current campaigns against the previous, manually adding ending and calculating the new totals
function createResult (bestNumber, minContribution, funds, leased, state) {
  const [activeRaised, activeCap, totalRaised, totalCap] =
    funds.reduce((
      [ar, ac, tr, tc],
      { info: { cap, end, raised }, isWinner },
    ) => [
      (bestNumber.gt(end) || isWinner) ? ar : ar.iadd(raised),
      (bestNumber.gt(end) || isWinner) ? ac : ac.iadd(cap),
      tr.iadd(raised),
      tc.iadd(cap),
    ], [new BN(0), new BN(0), new BN(0), new BN(0)])

  const hasNewActiveCap = !state.activeCap.eq(activeCap)
  const hasNewActiveRaised = !state.activeRaised.eq(activeRaised)
  const hasNewTotalCap = !state.totalCap.eq(totalCap)
  const hasNewTotalRaised = !state.totalRaised.eq(totalRaised)
  const hasChanged =
    !state.funds || state.funds.length !== funds.length ||
    hasNewActiveCap || hasNewActiveRaised || hasNewTotalCap ||
    hasNewTotalRaised ||
    funds.some((c) =>
      isFundUpdated(bestNumber, minContribution, c, leased, state))

  if (!hasChanged) return

  state.activeCap = hasNewActiveCap ? activeCap : state.activeCap
  state.activeRaised = hasNewActiveRaised ? activeRaised : state.activeRaised
  state.totalCap = hasNewTotalCap ? totalCap : state.totalCap
  state.totalRaised = hasNewTotalRaised ? totalRaised : state.totalRaised
  state.funds = funds
    .map((c) => updateFund(bestNumber, minContribution, c, leased))
    .sort(sortCampaigns)
}

function extractFundIds (keys) {
  return keys.map(({ args: [paraId] }) => paraId)
}
