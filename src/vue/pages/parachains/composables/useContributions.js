import { ref, reactive, watch, onBeforeUnmount, toRefs, computed } from 'vue'
import { keyring } from '@polkadot/ui-keyring'
import { u8aToHex } from '@polkadot/util'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto'

export function useContributions (paraId) {
  const state = reactive({
    myAccounts: [],
    myAccountsHex: [],
  })

  const allAccountsHex = ref([])

  const accountsSubscriber = keyring.accounts.subject.subscribe(accounts => {
    const allAccounts = accounts ? Object.keys(accounts) : []
    allAccountsHex.value = allAccounts.map((a) => u8aToHex(decodeAddress(a)))
  })

  const derive = useCall(api.derive.crowdloan.contributions, [paraId])
  const myContributions =
    useCall(
      api.derive.crowdloan.ownContributions,
      computed(() => ([paraId, state.myAccountsHex])),
    )

  function setState () {
    const myAccountsHex = derive.value?.contributorsHex
      .filter((h) => allAccountsHex.value.includes(h))

    if (myAccountsHex.length !== state.myAccountsHex.length) {
      state.myAccountsHex = myAccountsHex
      state.myAccounts =
        myAccountsHex.map((a) => encodeAddress(a, api.registry.chainSS58))
    }
  }

  watch([derive, allAccountsHex], setState)

  onBeforeUnmount(() => {
    if (accountsSubscriber) accountsSubscriber.unsubscribe()
  })

  return {
    ...toRefs(state),
    myContributions,
    derive,
  }
}
