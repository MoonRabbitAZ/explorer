import { CONFIG } from '@/config'

export const sessionStoragePlugin = (store) => {
  store.subscribe((mutation, state) => {
    switch (mutation.type) {
      default:
        setLocalStorage(state)
        break
    }
  })
}

function setLocalStorage (state) {
  localStorage.setItem(
    CONFIG.STORAGE_KEY,
    JSON.stringify(),
  )
}
