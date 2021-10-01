import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'

export function useEventTrigger (checks) {
  const store = useStore()
  const state = ref({
    blockHash: '',
    events: [],
  })

  const eventRecords = computed(() => store.getters[vuexTypes.lastHeaders])

  watch(eventRecords, () => {
    if (eventRecords.value?.length) {
      const events = eventRecords.value.filter((r) =>
        r.event && checks.some((c) => c && c.is(r.event)),
      )

      if (events.length) {
        state.value = {
          blockHash: eventRecords.value.createdAtHash?.toHex() || '',
          events,
        }
      }
    }
  },
  { immediate: true })

  return state
}
