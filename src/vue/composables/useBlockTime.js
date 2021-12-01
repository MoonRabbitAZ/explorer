import { api } from '@api'
import { extractTime, BN_ONE, BN } from '@polkadot/util'
import { useFormatTime } from '@/vue/composables'

const DEFAULT_TIME = new BN(6000)

export function useBlockTime () {
  const { formatDuration } = useFormatTime()

  const blockTime = (api.consts.babe?.expectedBlockTime ||
      api.consts.difficulty?.targetBlockTime ||
      api.consts.timestamp?.minimumPeriod.muln(2) ||
      DEFAULT_TIME)

  function calculateTimeNum (blocks = BN_ONE) {
    return blockTime.mul(blocks).toNumber()
  }

  function calculateTime (blocks = BN_ONE) {
    const value = calculateTimeNum(blocks)
    return extractTime(Math.abs(value))
  }

  function calculateTimeStr (blocks = BN_ONE, isShortTime = false) {
    const value = calculateTimeNum(blocks)
    return formatDuration(value, isShortTime)
  }

  return {
    calculateTimeNum,
    calculateTime,
    calculateTimeStr,
    blockTime: blockTime.toNumber(),
  }
}
