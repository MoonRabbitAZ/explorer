import { useMapKeys } from '@/vue/composables'
import { api } from '@api'

export function useTipHashes () {
  const triggers = [
    api.events.tips?.NewTip,
    api.events.tips?.TipClosed,
    api.events.tips?.TipRetracted,
  ]
  const entry = (api.query.tips || api.query.treasury)?.tips

  function extractHashes (keys) {
    return keys.map(({ args: [hash] }) => hash.toHex())
  }

  const mapKeys = useMapKeys(triggers, entry, extractHashes)

  return mapKeys
}
