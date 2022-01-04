import { BN_MILLION, BN_ZERO, u8aConcat } from '@polkadot/util'

import { reactive, toRefs, watch } from 'vue'
import { api } from '@api'
import { useCall } from './useCall'

const EMPTY_U8A_32 = new Uint8Array(32)

export function useTreasury () {
  const state = reactive({
    spendPeriod: api.consts.treasury
      ? api.consts.treasury.spendPeriod
      : BN_ZERO,
    treasuryAccount: u8aConcat(
      'modl',
      api.consts.treasury && api.consts.treasury.palletId
        ? api.consts.treasury.palletId.toU8a(true)
        : 'py/trsry',
      EMPTY_U8A_32,
    ).subarray(0, 32),
    freeBalance: undefined,
    burn: undefined,
  })

  const treasuryBalance = useCall(
    api.derive.balances?.account,
    [state.treasuryAccount],
  )

  watch(treasuryBalance, () => {
    if (treasuryBalance.value && api.consts.treasury) {
      state.freeBalance = treasuryBalance.value.freeBalance.gt(BN_ZERO)
        ? treasuryBalance.value.freeBalance
        : undefined
      state.burn = treasuryBalance.value.freeBalance.gt(BN_ZERO) &&
        !api.consts.treasury.burn.isZero()
        ? api.consts.treasury.burn
          .mul(treasuryBalance.value.freeBalance)
          .div(BN_MILLION)
        : BN_ZERO
    }
  })

  return { ...toRefs(state) }
}
