import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export function useResizeListener () {
  const viewport = reactive({
    width: 0,
    height: 0,
    resizeListeners: {},
  })

  function addResizeListener (listener) {
    const listenerId = uuidv4()
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

  return {
    viewport,
    addResizeListener,
    removeResizeListener,
  }
}
