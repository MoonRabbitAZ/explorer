const NATIVE_TOKEN_TYPE = 'native'

export class TokenRecord {
  constructor (record) {
    this._record = record

    this.ticker = record.ticker
    this.chainId = record.originalChainId
    this.originalType = record?.originalType || ''
    this.internalType = record?.internalType || ''
    this.originalContract = record.originalContract
    this.internalContract = record.internalContract
    this.originalChainName = record?.chain?.name || ''
    this.nativeChainDecimals = record?.chain?.nativeDecimals
  }

  get isInternalTypeNative () {
    return this.internalType === NATIVE_TOKEN_TYPE
  }
}
