
export class TokenRecord {
  constructor (record) {
    this._record = record
    this.tokenKey = record.tokenKey
    this.tokenTicker = record.tokenKey.ticker
    this.chainId = record.tokenKey.chainId
    this.originalChainId = record.attributes.originalChainId
    this.type = record.attributes.type
    this.originalContract = record.attributes.originalContract
    this.internalContract = record.attributes.internalContract
  }
}
