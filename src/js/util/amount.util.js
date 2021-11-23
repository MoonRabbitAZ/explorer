import BN from 'bn.js'
import { formatNumber, BN_TEN, bnToBn } from '@polkadot/util'

export function fromWei (weiInput, unitNum, withDelimiter = false) {
  const wei = bnToBn(weiInput)
  const base = BN_TEN.pow(new BN(unitNum))

  const baseLength = base.toString().length - 1 || 1

  let fraction = wei.mod(base).toString(10)

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`
  }
  fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1]

  const whole = wei.div(base).toString(10)
  const viewWhole = withDelimiter ? formatNumber(whole) : whole

  const result = `${viewWhole}${fraction === '0' ? '' : `.${fraction}`}`
  return result
}
