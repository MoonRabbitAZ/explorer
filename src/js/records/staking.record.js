import _get from 'lodash/get'

export class StakingRecord {
  constructor (record) {
    this._record = record

    this.address = _get(record, 'address', '')
    this.createdAt = _get(record, 'createdAt', '')
    this.status = _get(record, 'status')
    this.amount = _get(record, 'amount', '')
    this.stakeOptionId = _get(record, 'stakeOption.id', '')
  }
}
