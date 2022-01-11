import { reactive, onBeforeUnmount } from 'vue'
import uniqueId from 'lodash/uniqueId'

export function useResizeListener () {
  const viewport = reactive({
    width: 0,
    height: 0,
    resizeListeners: {},
  })

  function addResizeListener (listener) {
    const listenerId = uniqueId()
    viewport.resizeListeners[listenerId] = listener

    return listenerId
  }

  function removeResizeListener (listenerId) {
    delete viewport.resizeListeners[listenerId]
  }

  function updateDimensions () {
    viewport.width = window.innerWidth
    viewport.height = window.innerHeight

    Object.values(viewport.resizeListeners)
      .forEach(listener => listener())
  }

  updateDimensions()
  window.addEventListener('resize', updateDimensions)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateDimensions)
  })

  return {
    viewport,
    addResizeListener,
    removeResizeListener,
  }
}
