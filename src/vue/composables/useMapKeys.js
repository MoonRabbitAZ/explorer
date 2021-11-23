import { ref, watch } from 'vue'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { useEventTrigger } from '@/vue/composables'

export function useMapKeys (checks, entry, transform) {
  const transformKeys = ref(null)
  const trigger = useEventTrigger(checks)

  async function getMapKeys () {
    try {
      if (entry) {
        const keys = +trigger.value?.blockHash
          ? await entry.keysAt(trigger.value.blockHash)
          : await entry.keys()

        transformKeys.value = transform
          ? transform(keys)
          : keys
      }
    } catch (err) {
      ErrorHandler.processWithoutFeedback(err)
    }
  }

  watch(trigger, getMapKeys, { immediate: true })

  return transformKeys
}
