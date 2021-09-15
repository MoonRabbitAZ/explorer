import BN from 'bn.js'
import { api } from '@api'
import { extractTime, BN_ONE } from '@polkadot/util'
import { useGlobalTranslation } from '@/vue/composables'
import { reactive, toRefs } from 'vue'

const DEFAULT_TIME = new BN(6000)

export function useBlockTime (blocks = BN_ONE) {
  const { globalize: t } = useGlobalTranslation()
  const state = reactive({
    blockTime: 0,
    time: 0,
    timeStr: '',
  })

  state.blockTime = (
    api.consts.babe?.expectedBlockTime ||
    api.consts.difficulty?.targetBlockTime ||
    api.consts.timestamp?.minimumPeriod.muln(2) ||
    DEFAULT_TIME
  )

  const value = state.blockTime.mul(blocks).toNumber()
  state.time = extractTime(Math.abs(value))
  const { days, hours, minutes, seconds } = state.time
  state.timeStr = [
    days ? t('formats.time.days', { days }) : null,
    hours ? t('formats.time.hours', { hours }) : null,
    minutes ? t('formats.time.minutes', { minutes }) : null,
    seconds ? t('formats.time.seconds', { seconds }) : null,
  ]
    .filter(value => !!value)
    .join(' ') || t('formats.time.seconds', { seconds })

  state.blockTime = state.blockTime.toNumber()

  return {
    ...toRefs(state),
  }
}
