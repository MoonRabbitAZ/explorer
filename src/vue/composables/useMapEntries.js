import { ref, watch } from 'vue'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { useEventTrigger } from '@/vue/composables'

export function useMapEntries (checks, entry, transform) {
  const transformEntries = ref(null)
  const trigger = useEventTrigger(checks)

  async function getMapEntries () {
    const state = null

    try {
      if (entry) {
        const entries = +trigger.value?.blockHash
          ? await entry.entriesAt(trigger.value.blockHash)
          : await entry.entries()

        transformEntries.value = transform
          ? transform(entries)
          : entries
      }
    } catch (err) {
      ErrorHandler.processWithoutFeedback(err)
    }

    return state
  }

  watch(trigger, getMapEntries, { immediate: true })

  return transformEntries
}
