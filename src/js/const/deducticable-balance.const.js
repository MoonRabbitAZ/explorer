import CONFIG from '@/config'
import { BN } from '@polkadot/util'

const mainNode1 = 'wss://main.hole.moonrabbit.com'
const mainNode2 = 'wss://main2.hole.moonrabbit.com'

export const DEDUCTIBLE_BALANCE = new BN('80954000000000000000000')
export const ADMIN_ADDRESS = 'EksJMqhZGCbXfH2UaNA2z33xe2DjGsUnfdePycS2mzLXiZ1'
// eslint-disable-next-line max-len
export const IS_MAIN_NODE = CONFIG.WSS_NODE === mainNode1 || CONFIG.WSS_NODE === mainNode2
