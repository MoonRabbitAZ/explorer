
export class TokenRecord {
  constructor (record) {
    this._record = record

    this.tokenKey = record.tokenKey
    this.tokenTicker = record.tokenKey.ticker
    this.chainId = record.tokenKey.chainId
    this.type = record?.type || ''
    this.originalContract = record.originalContract
    this.internalContract = record.internalContract
  }
}
