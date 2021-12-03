import { computed } from 'vue'
import { useCall, useAccounts } from '@/vue/composables'
import { api } from '@api'

const transformMembers = {
  transform: (accounts) =>
    accounts.map((accountId) => accountId.toString()),
}

export function useCollectiveMembers (collective) {
  const { allAccounts } = useAccounts()
  const members = useCall(
    api.derive[collective]?.members,
    undefined,
    transformMembers,
  )

  const isMember = computed(() =>
    (members.value || []).some((accountId) =>
      allAccounts.value.includes(accountId),
    ),
  )

  return {
    members,
    isMember,
  }
}
