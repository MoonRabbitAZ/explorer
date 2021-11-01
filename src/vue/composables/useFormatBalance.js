import { formatBalance } from '@polkadot/util'
import { unref } from 'vue'
import BN from 'bn.js'

export function useFormatBalance () {
  function toBalance (value, decimals, options = true) {
    const unrefValue = unref(value)
    const unrefDecimals = unref(decimals)
    const bnValue = unrefValue instanceof BN
      ? unrefValue
      : new BN(unrefValue)
    return bnValue.isZero()
      ? `0 ${formatBalance.findSi().text}`
      : formatBalance(bnValue, options, unrefDecimals)
  }

  return {
    toBalance,
  }
}
