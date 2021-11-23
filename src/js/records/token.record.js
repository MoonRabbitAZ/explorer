import { TOKEN_TYPES } from '@/js/const/token.const'

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
    this.nativeChainDecimals = record?.chain?.nativeDecimals || ''
  }

  get isInternalTypeNative () {
    return this.internalType === TOKEN_TYPES.native
  }

  get isInternalTypeErc721 () {
    return this.internalType === TOKEN_TYPES.erc721
  }

  get isInternalTypeErc20 () {
    return this.internalType === TOKEN_TYPES.erc20
  }

  get isOriginalTypeNative () {
    return this.originalType === TOKEN_TYPES.native
  }

  get isOriginalTypeErc721 () {
    return this.originalType === TOKEN_TYPES.erc721
  }
}
