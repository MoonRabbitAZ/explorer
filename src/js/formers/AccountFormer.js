import { Former } from '@/js/formers/Former'
import { keyring } from '@polkadot/ui-keyring'

export class AccountFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      genesisHash: '',
      isHardware: false,
      name: '',
      password: '',
      seed: '',
      pairType: '',
      seedType: '',
      tags: [],
    }
  }

  async createAccount () {
    try {
      return keyring.addUri(
        this.attrs.seed,
        this.attrs.password,
        {
          genesisHash: this.attrs.genesisHash,
          isHardware: this.attrs.isHardware,
          name: this.attrs.name,
          tags: this.attrs.tags,
        },
        this.attrs.pairType,
      )
    } catch (e) {
      throw new Error(e)
    }
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
}
