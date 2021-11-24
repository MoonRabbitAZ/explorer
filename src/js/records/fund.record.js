export class FundRecord {
  constructor (record) {
    this.record = record.record

    this.accountId = record?.accountId
    this.paraId = record?.paraId
    this.info = record?.info
    this.firstSlot = record?.info?.firstPeriod
    this.lastSlot = record?.info?.lastPeriod
    this.value = record?.info?.raised
    this.isCrowdloan = record?.isCrowdloan || false
  }

  get key () {
    return this.paraId?.toString()
  }
}
