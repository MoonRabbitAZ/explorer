import { computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlockTime } from '@/vue/composables'

export function useFundInfo (fund, bestNumber, isOngoing) {
  const { t } = useI18n()
  const { calculateTimeStr } = useBlockTime()
  const unrefBestNumber = computed(() => unref(bestNumber))
  const unrefFund = computed(() => unref(fund))

  const blocksLeft = computed(() => {
    return unrefBestNumber.value &&
      unrefFund.value.info.end.gt(unrefBestNumber.value)
      ? unrefFund.value.info.end.sub(unrefBestNumber.value)
      : null
  })

  const fundStatus = computed(() => {
    if (unrefFund.value.isWinner) {
      return t('parachains-page.fund-row.status-winner')
    } else if (blocksLeft.value) {
      if (unrefFund.value.isCapped) {
        return t('parachains-page.fund-row.status-capped')
      } else if (isOngoing) {
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
    const info = unrefFund.value.info
    return info.cap.isZero()
      ? '100.00%'
      : `${(info.raised.muln(10000).div(info.cap).toNumber() / 100).toFixed(2)}%`
  })

  const period = computed(() => {
    const info = unrefFund.value.info
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
