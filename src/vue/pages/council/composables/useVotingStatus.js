import { ref, watch } from 'vue'
import { isFunction } from '@polkadot/util'
import { useCall } from '@/vue/composables'
import { api } from '@api'

export function useVotingStatus (votes, members, section) {
  const status = ref({
    hasFailed: false,
    hasPassed: false,
    isCloseable: false,
    isVoteable: false,
    remainingBlocks: null,
  })

  const bestNumber = useCall(api.derive.chain.bestNumber)

  function getStatus () {
    if (!bestNumber.value && votes.value) {
      status.value = {
        hasFailed: false,
        hasPassed: false,
        isCloseable: false,
        isVoteable: false,
        remainingBlocks: null,
      }
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
      status.value = {
        hasFailed: false,
        hasPassed: false,
        isCloseable: false,
        isVoteable: true,
        remainingBlocks: null,
      }
      return
    }

    const isEnd = bestNumber.value.gte(votes.value.end)
    const hasPassed = votes.value.threshold.lten(votes.value.ayes.length)
    const hasFailed = votes.value.threshold
      .gtn(Math.abs(members.value.length - votes.value.nays.length))

    status.value = {
      hasFailed,
      hasPassed,
      isCloseable: api.tx[modLocation].close.meta.args.length === 4 // current-generation
        ? isEnd || hasPassed || hasFailed
        : isEnd,
      isVoteable: !isEnd,
      remainingBlocks: isEnd
        ? null
        : votes.value.end.sub(bestNumber.value),
    }
  }

  watch([bestNumber, members, section], getStatus, { immediate: true })

  return status
}
