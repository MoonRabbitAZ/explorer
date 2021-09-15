import { Former } from '@/js/formers/Former'
import { api } from '@api'
import BN from 'bn.js'

export class TransferFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      senderAddress: '',
      recipientAddress: '',
      amount: '',
      isKeepAlive: '',
      isFullAmount: '',
      paymentInfo: {},
      tx: null,
    }
  }

  async initTx () {
    this.setTransferTx()
    await this.setPaymentInfo()
  }

  async setPaymentInfo () {
    this.attrs.paymentInfo =
      await this.attrs.tx.paymentInfo(this.attrs.senderAddress)
  }

  setTransferTx () {
    this.attrs.tx = this.attrs.isKeepAlive
      ? api.tx.balances.transferKeepAlive(
        this.attrs.recipientAddress,
        this.attrs.amount)
      : api.tx.balances.transfer(
        this.attrs.recipientAddress,
        this.attrs.amount)
  }

  populate (source) {
    this._populateFromRecord(source)
    return this
  }

  _populateFromRecord (source) {
    this.attrs = this.attrs || this._defaultAttrs
    this.attrs.genesisHash = source.genesisHash ||
      this._defaultAttrs.genesisHash
    this.attrs.isHardware = source.isHardware || this._defaultAttrs.isHardware
    this.attrs.name = source.name || this._defaultAttrs.name
    this.attrs.password = source.password || this._defaultAttrs.genesisHash
    this.attrs.seed = source.seed || this._defaultAttrs.seed
    this.attrs.pairType = source.pairType || this._defaultAttrs.pairType
    this.attrs.seedType = source.seedType || this._defaultAttrs.seedType
  }

  get bnAmountWithFee () {
    const bnAmount = new BN(this.attrs.amount)
    return this.attrs.paymentInfo.partialFee.add(bnAmount)
  }
}
