import { formatBalance } from '@polkadot/util'
import { unref } from 'vue'
import { fromWei } from '@/js/util/amount.util'
import { api } from '@api'
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

  function toExternalBalance (value, decimals, unitTicker) {
    const options = {
      withSi: true,
      withSiFull: false,
      withUnit: unitTicker,
    }

    const unrefValue = unref(value)
    const unrefDecimals = unref(decimals)
    const bnValue = unrefValue instanceof BN
      ? unrefValue
      : new BN(unrefValue)
    return bnValue.isZero()
      ? `0 ${unitTicker}`
      : formatBalance(bnValue, options, unrefDecimals)
  }

  function toFullBalance (value, decimals, unitTicker) {
    const currentDecimals = decimals || api.registry.chainDecimals[0]
    const currentTicker = unitTicker || formatBalance.findSi('-')?.text

    return `${fromWei(value, currentDecimals, true)} ${currentTicker}`
  }

  return {
    toBalance,
    toExternalBalance,
    toFullBalance,
  }
}
