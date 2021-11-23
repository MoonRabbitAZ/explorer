export class FundRecord {
  constructor (record) {
    this.record = record.record

    this.accountId = record?.accountId
    this.paraId = record?.paraId
    this.firstSlot = record?.firstSlot
    this.lastSlot = record?.lastSlot
    this.info = record?.info
    this.isCrowdloan = record?.isCrowdloan || false
    this.key = record?.key
  }
}
