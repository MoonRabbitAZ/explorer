import { useCall } from '@/vue/composables'
import { api } from '@api'
import { reactive, ref, watchEffect, onBeforeUnmount } from 'vue'
import { bnToBn } from '@polkadot/util'

const TICK_TIMEOUT = 100

export function useBlockTimer () {
  const state = reactive({
    before: 0,
    post: 0,
    type: '',
  })

  const timestamp = useCall(api.query.timestamp?.now)

  const lastNow = ref(Date.now())

  const timer = setInterval(() => { lastNow.value = Date.now() }, TICK_TIMEOUT)

  watchEffect(() => getDisplayValue(lastNow.value, timestamp.value))

  onBeforeUnmount(() => { clearInterval(timer) })

  function getDisplayValue (now = 0, value) {
    const tsValue = (
      value && (value).getTime
        ? (value).getTime()
        : bnToBn(value).toNumber()
    ) || 0

    if (!now || !tsValue) {
      return formatValue(0, 's')
    }

    const elapsed = Math.max(Math.abs(now - tsValue), 0) / 1000

    return (elapsed < 60)
      ? formatValue(elapsed, 's', elapsed < 15)
      : (elapsed < 3600)
          ? formatValue(elapsed / 60, 'min')
          : formatValue(elapsed / 3600, 'hr')
  }

  function formatValue (value, type = 's') {
    const [pre, post] = value.toFixed(1).split('.')

    state.before = pre
    state.post = post
    state.type = type
  }

  return state
}
