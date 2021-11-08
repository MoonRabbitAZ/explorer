export class UnfinishedFlowRecord {
  constructor (record) {
    this._record = record

    this.tokenId = record?.tokenId ?? ''
    this.tokenUri = record?.tokenUri ?? ''
    this.chainId = record?.chainId ?? ''
    this.amount = record?.amount ?? ''
    this.ticker = record?.ticker ?? ''
    this.type = record?.type ?? ''
    this.status = record?.status ?? ''
    this.txHash = record?.txHash ?? ''
    this.sender = record?.sender ?? ''
  }

  get isTypeWithdraw () {
    return this.ticker === 'withdraw'
  }
}
