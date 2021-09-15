import { formatBalance } from '@polkadot/util'
import { unref } from 'vue'
import BN from 'bn.js'

export function useFormatBalance () {
  function toBalance (value) {
    const unrefValue = unref(value)
    const bnValue = unrefValue instanceof BN
      ? unrefValue
      : new BN(unrefValue)
    return bnValue.isZero()
      ? `0 ${formatBalance.findSi().text}`
      : formatBalance(bnValue)
  }

  return {
    toBalance,
  }
}
