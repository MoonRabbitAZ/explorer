import _get from 'lodash/get'
import { STAKING_STATUSES } from '@/js/const/staking.const'
export class StakingRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.address = _get(record, 'address', '')
    this.createdAt = _get(record, 'createdAt', '')
    this.status = _get(record, 'status')
    this.amount = _get(record, 'amount', '')
    this.stakeOptionId = _get(record, 'stakeOption.id', '')
  }

  get isStatusPending () {
    return this.status === STAKING_STATUSES.pending
  }

  get isStatusWithdrawable () {
    return this.status === STAKING_STATUSES.withdrawable
  }
}
