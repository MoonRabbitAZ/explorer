export class ChainRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.name = record.name
    this.bridgeContract = record.bridgeContract
    this.isBase = record.isBase

    this.hexId = record.hexChainId
    this.rpcUrl = record.rpc
    this.blockExplorerUrl = record.explorer
    this.nativeCurrencyName = record.nativeCurrencyName
    this.nativeSymbol = record.nativeSymbol
    this.nativeDecimals = record?.nativeDecimals
  }
}
