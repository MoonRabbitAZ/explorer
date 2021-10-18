
export class EventWrapperRecord {
  constructor (record) {
    this.record = record.record
    this.blockHash = record?.blockHash
    this.blockNumber = record?.blockNumber
    this.indexes = record?.indexes
    this.key = record?.key
  }
}
