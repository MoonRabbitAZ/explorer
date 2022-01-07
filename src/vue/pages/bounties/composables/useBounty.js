import { ref, watch, computed } from 'vue'
import { useBlockTime } from '@/vue/composables'
import { useI18n } from 'vue-i18n'

export function useBounty (status, bestNumber) {
  const bountyState = ref(null)
  const { t } = useI18n()
  const { calculateTimeStr } = useBlockTime()

  function setStatus (currentStatus) {
    const defaultStatus = {
      beneficiary: undefined,
      bountyStatus: status.value.type,
      curator: undefined,
      unlockAt: undefined,
      updateDue: undefined,
    }

    bountyState.value = { ...defaultStatus, ...currentStatus }
  }

  function statusHandler () {
    if (status.value.isCuratorProposed) {
      setStatus({
        bountyStatus: 'CuratorProposed',
        curator: status.value.asCuratorProposed.curator,
      })
    }

    if (status.value.isActive) {
      setStatus({
        curator: status.value.asActive.curator,
        updateDue: status.value.asActive.updateDue,
      })
    }

    if (status.value.isPendingPayout) {
      setStatus({
        beneficiary: status.value.asPendingPayout.beneficiary,
        bountyStatus: 'PendingPayout',
        curator: status.value.asPendingPayout.curator,
        unlockAt: status.value.asPendingPayout.unlockAt,
      })
    }
  }

  setStatus()

  const blockNextAction = computed(() => {
    return bountyState.value?.updateDue || bountyState.value?.unlockAt
  })

  const isBlockNextAction = computed(() =>
    blockNextAction.value && bestNumber.value
      ? blockNextAction.value?.gt(bestNumber.value)
      : false,
  )

  const nextActionTime = computed(() => {
    if (!isBlockNextAction.value) return

    const blocksToNextAction = blockNextAction.value.sub(bestNumber.value)
    const time = calculateTimeStr(blocksToNextAction, true)

    return bountyState.value?.updateDue
      ? t('bounties-page.use-bounty.next-action-update', { time })
      : t('bounties-page.use-bounty.next-action-payout', { time })
  })

  watch(status, statusHandler, { immediate: true })

  return {
    bountyState,
    nextActionTime,
    blockNextAction,
  }
};
