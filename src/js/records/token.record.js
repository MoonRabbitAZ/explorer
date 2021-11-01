
export class TokenRecord {
  constructor (record) {
    this._record = record

    this.ticker = record.ticker
    this.chainId = record.originalChainId
    this.type = record?.type || ''
    this.originalContract = record.originalContract
    this.internalContract = record.internalContract
    this.originalChainName = record?.chain?.name || ''
  }
}
