import { ref, onBeforeUnmount } from 'vue'

export function useTimeNow (interval = 1000) {
  const timeNow = ref(new Date())

  const dateUpdateInterval = setInterval(() => {
    timeNow.value = new Date()
  }, interval)

  onBeforeUnmount(() => { clearInterval(dateUpdateInterval) })

  return timeNow
}
