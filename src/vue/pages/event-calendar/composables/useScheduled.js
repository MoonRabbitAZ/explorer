import { ref, watchEffect } from 'vue'
import { api } from '@api'
import { BN_ONE, BN_ZERO } from '@polkadot/util'
import { useCall, useBlockTime } from '@/vue/composables'
import { BLOCKCHAIN_EVENTS_TYPES } from '@/js/const/bloackchain-events-typs.const'

function newDate (blocks, blockTime) {
  const date = new Date(Date.now() + blocks.muln(blockTime).toNumber())

  return { date, dateTime: date.getTime() }
}

function createConstDurations (bestNumber, blockTime, items) {
  return items.map(([type, duration, additional = BN_ZERO]) => {
    if (!duration) {
      return [type, []]
    }

    const blocks = duration.sub(bestNumber.mod(duration))

    return [type, [{
      ...newDate(blocks, blockTime),
      blockNumber: bestNumber.add(blocks),
      blocks,
      info: bestNumber.div(duration).iadd(additional),
    }]]
  })
}

function createCouncilMotions (bestNumber, blockTime, motions) {
  return [[BLOCKCHAIN_EVENTS_TYPES.councilMotion, motions
    .map(({ hash, votes }) => {
      if (!votes) {
        return null
      }

      const hashStr = hash.toHex()
      const blocks = votes.end.sub(bestNumber)

      return {
        ...newDate(blocks, blockTime),
        blockNumber: votes.end,
        blocks,
        info: `${hashStr.substr(0, 6)}…${hashStr.substr(-4)}`,
      }
    })
    .filter((item) => !!item),
  ]]
}

function createDispatches (bestNumber, blockTime, dispatches) {
  return dispatches.map(({ at, index }) => {
    const blocks = at.sub(bestNumber)

    return [BLOCKCHAIN_EVENTS_TYPES.democracyDispatch, [{
      ...newDate(blocks, blockTime),
      blockNumber: at,
      blocks,
      info: index,
    }]]
  })
}

function createReferendums (bestNumber, blockTime, referendums) {
  return referendums.reduce((result, { index, status }) => {
    const enactBlocks = status.end.add(status.delay).isub(bestNumber)
    const voteBlocks = status.end.sub(bestNumber).isub(BN_ONE)

    result.push([BLOCKCHAIN_EVENTS_TYPES.referendumVote, [{
      ...newDate(voteBlocks, blockTime),
      blockNumber: bestNumber.add(voteBlocks),
      blocks: voteBlocks,
      info: index,
    }]])
    result.push([BLOCKCHAIN_EVENTS_TYPES.referendumDispatch, [{
      ...newDate(enactBlocks, blockTime),
      blockNumber: bestNumber.add(enactBlocks),
      blocks: enactBlocks,
      info: index,
      isPending: true,
    }]])

    return result
  }, [])
}

function createStakingInfo (
  bestNumber,
  blockTime,
  sessionInfo,
  unapplied,
  slashDeferDuration,
) {
  const blocksEra = sessionInfo.eraLength.sub(sessionInfo.eraProgress)
  const blocksSes = sessionInfo.sessionLength.sub(sessionInfo.sessionProgress)
  const slashDuration = slashDeferDuration?.mul(sessionInfo.eraLength)
  const slashEras = slashDuration
    ? unapplied
      .filter(([, values]) => values.length)
      .map(([key]) => {
        const eraIndex = key.args[0]
        const blockProgress = sessionInfo.activeEra.sub(eraIndex)
          .isub(BN_ONE)
          .imul(sessionInfo.eraLength)
          .iadd(sessionInfo.eraProgress)
        const blocks = slashDuration.sub(blockProgress)

        return {
          ...newDate(blocks, blockTime),
          blockNumber: bestNumber.add(blocks),
          blocks,
          info: eraIndex,
        }
      })
    : []

  return [
    [BLOCKCHAIN_EVENTS_TYPES.stakingEpoch, [{
      ...newDate(blocksSes, blockTime),
      blockNumber: bestNumber.add(blocksSes),
      blocks: blocksSes,
      info: sessionInfo.currentIndex.add(BN_ONE),
    }]],
    [BLOCKCHAIN_EVENTS_TYPES.stakingEra, [{
      ...newDate(blocksEra, blockTime),
      blockNumber: bestNumber.add(blocksEra),
      blocks: blocksEra,
      info: sessionInfo.activeEra.add(BN_ONE),
    }]],
    [BLOCKCHAIN_EVENTS_TYPES.stakingSlash, slashEras],
  ]
}

function createScheduled (bestNumber, blockTime, scheduled) {
  return [[BLOCKCHAIN_EVENTS_TYPES.scheduler, scheduled
    .filter(
      ([, vecSchedOpt]) => vecSchedOpt.some((schedOpt) => schedOpt.isSome))
    .reduce((items, [key, vecSchedOpt]) => {
      const blockNumber = key.args[0]

      return vecSchedOpt
        .filter((schedOpt) => schedOpt.isSome)
        .map((schedOpt) => schedOpt.unwrap())
        .reduce((items, { maybeId }) => {
          const idOrNull = maybeId.unwrapOr(null)
          const blocks = blockNumber.sub(bestNumber)

          items.push({
            ...newDate(blocks, blockTime),
            blockNumber,
            blocks,
            info: idOrNull
              ? idOrNull.isAscii
                ? idOrNull.toUtf8()
                : idOrNull.toHex()
              : null,
          })

          return items
        }, items)
    }, [])]]
}

function createAuctionInfo (
  bestNumber,
  blockTime,
  [leasePeriod, endBlock],
) {
  const blocks = endBlock.sub(bestNumber)

  return [
    [BLOCKCHAIN_EVENTS_TYPES.parachainAuction, [{
      ...newDate(blocks, blockTime),
      blockNumber: endBlock,
      blocks,
      info: `${leasePeriod.toString()}`,
    }]],
  ]
}

export default function useScheduled () {
  const state = ref([])
  const { blockTime } = useBlockTime()
  const auctionInfo = useCall(api.query.auctions?.auctionInfo)
  const councilMotions = useCall(api.derive.council?.proposals)
  const dispatches = useCall(api.derive.democracy?.dispatchQueue)
  const referendums = useCall(api.derive.democracy?.referendums)
  const scheduled = useCall(api.query.scheduler?.agenda?.entries)
  const sessionInfo = useCall(api.derive.session?.progress)
  const bestNumber = useCall(api.derive.chain.bestNumber)
  const slashes = useCall(api.query.staking?.unappliedSlashes.entries)

  function addFiltered (types) {
    return types.reduce((state, [typeFilter, items]) => {
      return state
        .filter(({ type }) => type !== typeFilter)
        .concat(...items?.map((item) => {
          item.type = typeFilter

          return item
        }))
    }, state.value)
  }

  watchEffect(() => {
    if (bestNumber.value) {
      if (dispatches.value) {
        state.value = addFiltered(
          createDispatches(bestNumber.value, blockTime.value, dispatches.value))
      }

      if (councilMotions.value) {
        state.value = addFiltered(
          createCouncilMotions(
            bestNumber.value,
            blockTime.value,
            councilMotions.value,
          ))
      }

      if (referendums.value) {
        state.value = addFiltered(
          createReferendums(
            bestNumber.value,
            blockTime.value,
            referendums.value,
          ))
      }

      if (scheduled.value) {
        state.value = addFiltered(
          createScheduled(bestNumber.value, blockTime.value, scheduled.value))
      }

      if (sessionInfo.value?.sessionLength.gt(BN_ONE)) {
        state.value = addFiltered(
          createStakingInfo(
            bestNumber.value,
            blockTime.value,
            sessionInfo.value,
            slashes.value || [],
            api.consts.staking?.slashDeferDuration,
          ))
      }

      if (auctionInfo.value?.isSome) {
        state.value = addFiltered(
          createAuctionInfo(
            bestNumber.value,
            blockTime.value,
            auctionInfo.value.unwrap(),
          ))
      }

      if (bestNumber.value) {
        state.value = addFiltered(
          createConstDurations(bestNumber.value, blockTime.value, [
            [
              BLOCKCHAIN_EVENTS_TYPES.councilElection,
              (api.consts.elections || api.consts.phragmenElection ||
              api.consts.electionsPhragmen)?.termDuration,
            ],
            [
              BLOCKCHAIN_EVENTS_TYPES.democracyLaunch,
              api.consts.democracy?.launchPeriod,
            ],
            [
              BLOCKCHAIN_EVENTS_TYPES.parachainLease,
              api.consts.slots?.leasePeriod, BN_ONE,
            ],
            [
              BLOCKCHAIN_EVENTS_TYPES.societyChallenge,
              api.consts.society?.challengePeriod,
            ],
            [
              BLOCKCHAIN_EVENTS_TYPES.societyRotate,
              api.consts.society?.rotationPeriod,
            ],
            [
              BLOCKCHAIN_EVENTS_TYPES.treasurySpend,
              api.consts.treasury?.spendPeriod,
            ],
          ]),
        )
      }
    }
  })

  return state
}
