import { ref, watch } from 'vue'
import { isFunction } from '@polkadot/util'
import { useCall } from '@/vue/composables'
import { api } from '@api'

export function useVotingStatus (votes, members, section) {
  const status = ref({})

  function setStatus (currentStatus) {
    status.value = {
      hasFailed: currentStatus?.hasFailed || false,
      hasPassed: currentStatus?.hasPassed || false,
      isCloseable: currentStatus?.isCloseable || false,
      isVoteable: currentStatus?.isVoteable || false,
      remainingBlocks: currentStatus?.remainingBlocks || null,
    }
  }

  setStatus()

  const bestNumber = useCall(api.derive.chain.bestNumber)

  function updateStatus () {
    if (!bestNumber.value && votes.value) {
      setStatus()
      return
    }

    const specName = api.runtimeVersion.specName.toString()
    const moduleInstances =
      api.registry.getModuleInstances(specName, section.value) || []
    const instance = moduleInstances[0] || section.value

    const modLocation = isFunction(api.tx[instance]?.close)
      ? instance
      : null

    if (!votes.value.end || !modLocation) {
      setStatus({ isVoteable: true })
      return
    }

    const isEnd = bestNumber.value.gte(votes.value.end)
    const hasPassed = votes.value.threshold.lten(votes.value.ayes.length)
    const hasFailed = votes.value.threshold
      .gtn(Math.abs(members.value.length - votes.value.nays.length))

    setStatus({
      hasFailed,
      hasPassed,
      isCloseable: api.tx[modLocation].close.meta.args.length === 4 // current-generation
        ? isEnd || hasPassed || hasFailed
        : isEnd,
      isVoteable: !isEnd,
      remainingBlocks: isEnd
        ? null
        : votes.value.end.sub(bestNumber.value),
    })
  }

  watch([bestNumber, members, section], updateStatus, { immediate: true })

  return status
}
