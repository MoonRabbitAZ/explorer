import BN from 'bn.js'
import { api } from '@api'
import { extractTime, BN_ONE } from '@polkadot/util'
import { useGlobalTranslation } from '@/vue/composables'

const DEFAULT_TIME = new BN(6000)

export function useBlockTime () {
  const { globalize: t } = useGlobalTranslation()

  const blockTime = (api.consts.babe?.expectedBlockTime ||
      api.consts.difficulty?.targetBlockTime ||
      api.consts.timestamp?.minimumPeriod.muln(2) ||
      DEFAULT_TIME)

  function extTime (value) {
    return extractTime(Math.abs(value))
  }

  function calculateTimeBn (blocks = BN_ONE) {
    return blockTime.mul(blocks).toNumber()
  }

  function calculateTime (blocks = BN_ONE) {
    const value = calculateTimeBn(blocks)
    return extTime(value)
  }

  function calculateTimeStr (blocks = BN_ONE, isShortTime = false) {
    const value = calculateTimeBn(blocks)
    const { days, hours, minutes, seconds } = extTime(value)
    const timeArr = [
      days ? t('formats.time.days', { days }) : null,
      hours ? t('formats.time.hours', { hours }) : null,
      minutes ? t('formats.time.minutes', { minutes }) : null,
      seconds ? t('formats.time.seconds', { seconds }) : null,
    ]
      .filter(value => !!value)
    return isShortTime
      ? timeArr.slice(0, 2).join(' ')
      : timeArr.join(' ') || t('formats.time.seconds', { seconds })
  }

  return {
    calculateTimeBn,
    calculateTime,
    calculateTimeStr,
    blockTime: blockTime.toNumber(),
  }
}
