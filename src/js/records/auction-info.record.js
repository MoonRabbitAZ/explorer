
export class AuctionInfoRecord {
  constructor (record) {
    this._record = record

    this.leasePeriod = record?.leasePeriod || null
    this.endBlock = record?.endBlock || null
    this.numAuctions = record?.numAuctions || null
  }
}
