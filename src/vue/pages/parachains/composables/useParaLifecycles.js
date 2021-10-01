import { useMapEntries } from '@/vue/composables'
import { api } from '@api'

function extractIds (entries) {
  return entries
    .reduce((acc, [{ args: [paraId] }, optValue]) => {
      const value = optValue.unwrap()

      return value && (
        value.isParathread ||
        value.isUpgradingToParachain ||
        value.isOutgoingParathread ||
        value.isOnboarding
      )
        ? [...acc, paraId]
        : acc
    }, [])
    .sort((a, b) => a.cmp(b))
}

export function useParaLifecycles () {
  return useMapEntries(
    [api.events.session.NewSession, api.events.registrar.Registered],
    api.query.paras.paraLifecycles,
    extractIds,
  )
}
