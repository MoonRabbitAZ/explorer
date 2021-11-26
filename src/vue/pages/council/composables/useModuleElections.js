import { computed } from 'vue'
import { api } from '@api'

export function useModuleElections () {
  const moduleElections = computed(() => {
    if (api.tx.phragmenElection) return 'phragmenElection'
    else if (api.tx.electionsPhragmen) return 'electionsPhragmen'
    else if (api.tx.elections) return 'elections'
    else return null
  })

  const hasElections = computed(() => Boolean(moduleElections.value))

  return {
    moduleElections,
    hasElections,
  }
}
