
export class LeasePeriodRecord {
  constructor (record) {
    this.record = record.record

    this.currentPeriod = record?.currentPeriod
    this.length = record?.length
    this.progress = record?.progress
    this.remainder = record?.remainder
  }
}
