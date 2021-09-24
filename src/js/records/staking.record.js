import _get from 'lodash/get'

export class StakingRecord {
  constructor (record) {
    this._record = record

    this.address = _get(record, 'address', '')
    this.amount = _get(record, 'amount', '')
    this.interestRate = _get(record, 'interestRate', '')
    this.createdAt = _get(record, 'createdAt', '')
  }
}
