import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const viewport = reactive({
  width: 0,
  height: 0,
  resizeListeners: {},

  get isSmall () {
    return this.width <= 1200
  },

  addResizeListener (listener) {
    const listenerId = uuidv4()
    this.resizeListeners[listenerId] = listener

    return listenerId
  },

  removeResizeListener (listenerId) {
    delete this.resizeListeners[listenerId]
  },

  updateDimensions () {
    this.width = window.innerWidth
    this.height = window.innerHeight

    Object.values(this.resizeListeners)
      .forEach(listener => listener())
  },
})

viewport.updateDimensions()
window.addEventListener('resize', () => { viewport.updateDimensions() })
