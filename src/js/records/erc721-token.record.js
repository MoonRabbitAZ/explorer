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
    const ipfsRegex = /^ipfs:\/{2}/
    const isHttp = /^https?:\/{2}/.test(this.image)
    const isIpfs = ipfsRegex.test(this.image)

    return (isHttp && this.image) ||
      (isIpfs && (IPFS_URL + this.image.replace(ipfsRegex, ''))) ||
      ''
  }
}
