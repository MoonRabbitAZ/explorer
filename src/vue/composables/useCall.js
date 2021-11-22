import { ErrorHandler } from '@/js/helpers/error-handler'
import { reactive, ref, onBeforeUnmount, watch, isRef, unref } from 'vue'
import { isNull, isUndefined } from '@polkadot/util'

const VALID_PARAMS = 2 // number of valid parameters, if isDoubleMap = true

// extract the serialized and mapped params, all ready for use in our call
function extractParams (params = []) {
  if (params.length) {
    return !params.some((param) => isNull(param) || isUndefined(param))
      ? params
      : null
  } else {
    return params
  }
}

// unsubscribe and remove from  the tracker
export function unsubscribe (tracker) {
  tracker.isActive = false

  if (tracker.subscriber) {
    tracker.subscriber()
    tracker.subscriber = null
  }
}

// subscribe, trying to play nice with the browser threads
async function subscribe (
  tracker,
  callValue,
  fn,
  params,
  { transform = value => value, withParams, withParamsTransform } = {},
) {
  try {
    const validParams = params.filter((p) => !isUndefined(p))

    unsubscribe(tracker)

    if (fn && (!fn.meta?.type?.isDoubleMap ||
        validParams.length === VALID_PARAMS)) {
      tracker.isActive = true

      tracker.subscriber = await fn(...params, (ev) => {
        if (tracker.isActive) {
          callValue.value = withParams
            ? { params, ev: transform(ev) }
            : withParamsTransform
              ? transform({ params, ev })
              : transform(ev)
        }
      })
    } else {
      tracker.subscriber = null
    }
  } catch (e) {
    ErrorHandler.process(e)
  }
}

export function useCall (fn, params, options) {
  const tracker = reactive({
    isActive: false,
    subscriber: null,
  })

  const callValue = ref(null)

  // initial effect, we need an un-subscription
  onBeforeUnmount(() => { unsubscribe(tracker) })

  const initSubscribe = async () => {
    // check if we have a function & that we are mounted
    const mappedParams = extractParams(unref(params))

    if (mappedParams) {
      await subscribe(tracker, callValue, fn, mappedParams, options)
    }
  }

  if (isRef(params)) {
    watch(params, initSubscribe, { immediate: true })
  } else {
    initSubscribe()
  }

  return callValue
}
