
export class ChainRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.name = record.name
    this.bridgeContract = record.bridgeContract
    this.isBase = record.isBase
    this.nativeDecimals = record?.nativeDecimals
  }
}
