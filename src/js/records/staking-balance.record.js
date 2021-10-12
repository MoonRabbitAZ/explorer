export class StakingBalanceRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.balance = record?.sum ?? ''
  }
}
