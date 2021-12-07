import { reactive, onBeforeUnmount, toRefs } from 'vue'
import { keyring } from '@polkadot/ui-keyring'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'

export function useAccounts () {
  const state = reactive({
    allAccounts: [],
    allAccountsHex: [],
    isAccountsLoaded: false,
    hasAccounts: false,
  })

  const subscription = keyring.accounts.subject.subscribe((accounts) => {
    state.allAccounts = accounts ? Object.keys(accounts) : []
    state.allAccountsHex =
        state.allAccounts.map((a) => u8aToHex(decodeAddress(a)))
    state.hasAccounts = Boolean(state.allAccounts.length)
    state.isAccountsLoaded = true
  })

  onBeforeUnmount(() => { subscription?.unsubscribe() })

  return {
    ...toRefs(state),
  }
}
