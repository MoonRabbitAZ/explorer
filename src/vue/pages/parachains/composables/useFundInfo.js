import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlockTime } from '@/vue/composables'

export function useFundInfo (fund, bestNumber) {
  const { t } = useI18n()
  const { calculateTimeStr } = useBlockTime()

  const blocksLeft = computed(() => {
    if (!bestNumber && !fund.info.end.gt(bestNumber)) return
    return fund.info.end.sub(bestNumber)
  })

  const fundStatus = computed(() => {
    if (fund.isWinner) {
      return t('parachains-page.fund-row.status-winner')
    } else if (blocksLeft.value) {
      if (fund.isCapped) {
        return t('parachains-page.fund-row.status-capped')
      } else if (fund.isOngoing) {
        return t('parachains-page.fund-row.status-active')
      } else {
        return t('parachains-page.fund-row.status-past')
      }
    } else {
      return t('parachains-page.fund-row.status-ended')
    }
  })

  const blocksLeftTime = computed(() => {
    if (!blocksLeft.value) return
    return calculateTimeStr(blocksLeft.value, true)
  })

  const raisedProgress = computed(() => {
    const info = fund.info
    return info.cap.isZero()
      ? '100.00%'
      : `${(info.raised.muln(10000).div(info.cap).toNumber() / 100).toFixed(2)}%`
  })

  const period = computed(() => {
    const info = fund.info
    return info.firstPeriod.eq(info.lastPeriod)
      ? info.firstPeriod.toString()
      : `${info.firstPeriod.toString()} - ${info.lastPeriod.toString()}`
  })

  return {
    blocksLeft,
    fundStatus,
    blocksLeftTime,
    raisedProgress,
    period,
  }
}
