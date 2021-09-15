import BN from 'bn.js'
import { BN_TEN } from '@polkadot/util'

export function fromWei (weiInput, unitNUm) {
  const wei = new BN(weiInput)
  const base = BN_TEN.pow(new BN(unitNUm))

  const baseLength = base.toString().length - 1 || 1

  let fraction = wei.mod(base).toString(10)

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`
  }
  fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1]

  const whole = wei.div(base).toString(10)

  const result = `${whole}${fraction === '0' ? '' : `.${fraction}`}`
  return result
}
