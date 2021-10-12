import { useMapEntries } from '@/vue/composables'
import { api } from '@api'

function extractIds (entries) {
  return entries
    .reduce((acc, [{ args: [paraId] }, optValue]) => {
      const value = optValue.unwrap()

      const isActiveParathread = Boolean(
        value?.isParathread ||
        value?.isUpgradingToParachain ||
        value?.isOutgoingParathread ||
        value?.isOnboarding,
      )
      if (isActiveParathread) acc.push(paraId)

      return acc
    }, [])
    .sort((a, b) => a.cmp(b))
}

export function useThreadIds () {
  return useMapEntries(
    [api.events.session.NewSession, api.events.registrar.Registered],
    api.query.paras.paraLifecycles,
    extractIds,
  )
}
