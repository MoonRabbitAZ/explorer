import { STAKING_STATUSES } from '@/js/const/staking.const'
import { api } from '@api'
import { fromWei } from '@/js/util/amount.util'
export class StakingRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.address = record?.address ?? ''
    this.createdAt = record?.createdAt ?? ''
    this.lockedUntil = record?.lockedUntil ?? ''
    this.status = record?.status ?? ''
    this.amount = record?.amount ?? ''
    this.resultAmount = record?.resultAmount ?? ''
    this.stakeOptionId = record?.stakeOption?.id ?? ''
    this.rewardFraction = record?.stakeOption?.rewardFraction ?? ''
  }

  get isStatusPending () {
    return this.status === STAKING_STATUSES.pending
  }

  get isStatusWithdrawable () {
    return this.status === STAKING_STATUSES.withdrawable
  }

  get rewardPercent () {
    return this.rewardFraction
      ? `${fromWei(this.rewardFraction, api.registry.chainDecimals[0])}%`
      : ''
  }
}
