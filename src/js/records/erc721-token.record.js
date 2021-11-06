import CONFIG from '@/config'

const IPFS_URL = CONFIG.TOKEN_URI_PROTOCOL + '://' + CONFIG.TOKEN_URI_HOST

export class Erc721TokenRecord {
  constructor (record) {
    this._record = record

    this.id = record?.id || ''
    this.tokenUri = record?.tokenUri || ''
    this.name = record?.name || ''
    this.image = record?.image || ''
  }

  get imageUrl () {
    return this.image.startsWith('http://') || this.image.startsWith('https://')
      ? this.image
      : this.image.startsWith('ipfs://')
        ? IPFS_URL + this.image.replace('ipfs://', '')
        : ''
  }
}
